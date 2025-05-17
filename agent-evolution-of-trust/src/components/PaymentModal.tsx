import { useState, useEffect } from 'react';
import { Loader2, Zap, Copy, Check, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../utils/api';
import type { InvoiceResponse, InvoiceStatus } from '../utils/api';
import './PaymentModal.css';

interface PaymentModalProps {
  onPaymentComplete: () => void;
  onClose?: () => void;
}

export default function PaymentModal({ onPaymentComplete, onClose }: PaymentModalProps) {
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        const status: InvoiceStatus = await api.checkInvoiceStatus();
        
        if (status.isPaid) {
          clearInterval(pollInterval);
          onPaymentComplete();
        }
      } catch (err) {
        console.error('Failed to check invoice status:', err);
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

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        {onClose && (
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        )}
        
        {loading ? (
          <div className="modal-loading">
            <Loader2 className="icon-spin" size={32} />
            <p>Creating invoice...</p>
          </div>
        ) : error ? (
          <div className="modal-error">
            <p>{error}</p>
            <button onClick={createInvoice}>Try Again</button>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <Zap size={32} />
              <h3>Game Entry</h3>
              <p>150 sats • 50 credit bonus</p>
            </div>

            {invoice && (
              <div className="qr-container">
                <QRCodeSVG 
                  value={invoice.invoice}
                  size={200}
                  level="M"
                  includeMargin={true}
                  fgColor="#ffffff"
                  bgColor="#1a1a1a"
                />
              </div>
            )}

            <button className="copy-button-modal" onClick={copyInvoice}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Invoice'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}