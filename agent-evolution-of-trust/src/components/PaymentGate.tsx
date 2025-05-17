import { useState, useEffect } from 'react';
import { Loader2, Zap, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../utils/api';
import type { InvoiceResponse, InvoiceStatus } from '../utils/api';
import './PaymentGate.css';

interface PaymentGateProps {
  onPaymentComplete: () => void;
}

export default function PaymentGate({ onPaymentComplete }: PaymentGateProps) {
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    createInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createInvoice = async () => {
    try {
      setLoading(true);
      const invoiceData = await api.createInvoice();
      setInvoice(invoiceData);
      setError(null);
      
      // Start polling for payment status
      startStatusPolling();
    } catch (err) {
      setError('Failed to create invoice');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startStatusPolling = () => {
    const pollInterval = setInterval(async () => {
      try {
        setCheckingStatus(true);
        const status: InvoiceStatus = await api.checkInvoiceStatus();
        
        if (status.isPaid) {
          clearInterval(pollInterval);
          onPaymentComplete();
        }
      } catch (err) {
        console.error('Failed to check invoice status:', err);
      } finally {
        setCheckingStatus(false);
      }
    }, 3000); // Check every 3 seconds
  };

  const copyInvoice = () => {
    if (invoice) {
      navigator.clipboard.writeText(invoice.invoice);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="payment-gate">
        <Loader2 className="icon-spin" size={32} />
        <p>Creating invoice...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-gate">
        <p className="error">{error}</p>
        <button onClick={createInvoice}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="payment-gate">
      <div className="invoice-header">
        <Zap size={48} />
        <h2>New Game Entry</h2>
      </div>
      
      <div className="invoice-details">
        <p className="amount">{invoice?.amountSats} sats</p>
        <p className="memo">{invoice?.memo}</p>
        <p className="credit-info">
          Pay 150 sats, get 50 sats credit for bot donations
        </p>
      </div>

      {invoice && (
        <>
          <p className="scan-label">Scan with Lightning Wallet</p>
          <div className="qr-code-container">
            <QRCodeSVG 
              value={invoice.invoice}
              size={256}
              level="M"
              includeMargin={true}
              fgColor="#ffffff"
              bgColor="#1a1a1a"
              style={{ borderRadius: '8px' }}
            />
          </div>
        </>
      )}

      <div className="invoice-code">
        <code>{invoice?.invoice}</code>
        <button className="copy-button" onClick={copyInvoice}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {checkingStatus && (
        <div className="checking-status">
          <Loader2 className="icon-spin" size={16} />
          <span>Checking payment status...</span>
        </div>
      )}
    </div>
  );
}