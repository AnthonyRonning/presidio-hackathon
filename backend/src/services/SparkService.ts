import { SparkWallet } from "@buildonspark/spark-sdk";

export interface LightningInvoice {
    id: string;
    invoice: string;
    amountSats: number;
    memo: string;
    isPaid: boolean;
}

export class SparkService {
    private wallet: SparkWallet | null = null;
    private invoiceStatus: Map<string, boolean> = new Map();
    private invoiceDetails: Map<string, LightningInvoice> = new Map();
    private processedInvoices: Set<string> = new Set();

    async initialize(): Promise<void> {
        if (this.wallet) return;

        try {
            const mnemonic = process.env.SPARK_WALLET_MNEMONIC;
            if (!mnemonic) {
                throw new Error('SPARK_WALLET_MNEMONIC not set in environment variables');
            }

            const result = await SparkWallet.initialize({
                mnemonicOrSeed: mnemonic,
                options: {
                    network: process.env.SPARK_NETWORK as any || "MAINNET"
                }
            });
            
            this.wallet = result.wallet;
            console.log('Spark wallet initialized successfully');
            
            // Listen for transfer claimed events
            this.wallet.on('transfer:claimed', (transferId: string, updatedBalance: number) => {
                console.log(`Transfer claimed event: ${transferId}, balance: ${updatedBalance}`);
                // Mark the invoice as paid in our local cache
                this.invoiceStatus.set(transferId, true);
            });
        } catch (error) {
            console.error('Failed to initialize Spark wallet:', error);
            throw error;
        }
    }

    async createGameInvoice(gameId: string, amountSats: number = 150, memo?: string): Promise<LightningInvoice> {
        if (!this.wallet) {
            await this.initialize();
        }

        if (!this.wallet) {
            throw new Error('Wallet initialization failed');
        }

        try {
            const lightningReceiveRequest = await this.wallet.createLightningInvoice({
                amountSats,
                memo: memo || `Game credits for game ${gameId}`
            });

            console.log('Created Lightning invoice:', {
                id: lightningReceiveRequest.id,
                status: lightningReceiveRequest.status,
                paymentHash: lightningReceiveRequest.invoice.paymentHash
            });

            const invoiceData = {
                id: lightningReceiveRequest.id,
                invoice: lightningReceiveRequest.invoice.encodedInvoice,
                amountSats,
                memo: memo || `Game credits for game ${gameId}`,
                isPaid: false
            };
            
            // Store invoice details for later retrieval
            this.invoiceDetails.set(lightningReceiveRequest.id, invoiceData);
            
            return invoiceData;
        } catch (error) {
            console.error('Failed to create Lightning invoice:', error);
            throw error;
        }
    }

    async checkInvoiceStatus(invoiceId: string): Promise<boolean> {
        if (!this.wallet) {
            await this.initialize();
        }

        if (!this.wallet) {
            throw new Error('Wallet initialization failed');
        }

        console.log(`Checking invoice status for ID: ${invoiceId}`);
        
        try {
            // Actively check the invoice status from the SDK
            const receiveRequest = await (this.wallet as any).getLightningReceiveRequest(invoiceId);
            console.log('Lightning receive request status:', receiveRequest.status);
            
            const isPaid = receiveRequest.status === 'LIGHTNING_PAYMENT_RECEIVED' || 
                          receiveRequest.status === 'TRANSFER_COMPLETED';
            
            if (isPaid) {
                this.invoiceStatus.set(invoiceId, true);
            }
            
            return isPaid;
        } catch (error) {
            console.error('Error checking invoice status:', error);
            // Fall back to cache
            return this.invoiceStatus.get(invoiceId) || false;
        }
    }

    async listenForPayments(invoiceId: string, callback: (paid: boolean) => void): Promise<void> {
        if (!this.wallet) {
            await this.initialize();
        }

        if (!this.wallet) {
            throw new Error('Wallet initialization failed');
        }

        // Set up a specific listener for this invoice
        const handleTransferClaimed = (transferId: string) => {
            if (transferId === invoiceId) {
                callback(true);
                this.wallet?.off('transfer:claimed', handleTransferClaimed);
            }
        };

        this.wallet.on('transfer:claimed', handleTransferClaimed);
    }

    async getInvoiceDetails(invoiceId: string): Promise<LightningInvoice> {
        const details = this.invoiceDetails.get(invoiceId);
        if (!details) {
            throw new Error('Invoice details not found');
        }
        return details;
    }

    isInvoiceProcessed(invoiceId: string): boolean {
        return this.processedInvoices.has(invoiceId);
    }

    markInvoiceAsProcessed(invoiceId: string): void {
        this.processedInvoices.add(invoiceId);
    }
}

export const sparkService = new SparkService();