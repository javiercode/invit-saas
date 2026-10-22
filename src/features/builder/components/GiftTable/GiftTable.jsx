import React, { useState } from 'react';
import { Gift, ExternalLink, Copy, Check, CreditCard } from 'lucide-react';
import './GiftTable.css';

export const GiftTable = ({
  message = "Tu presencia es nuestro mejor regalo. Si deseas obsequiarnos algo, te dejamos algunas opciones:",
  stores = [],
  bankDetails = null
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="gift-table-card">
      <div className="gift-header">
        <div className="gift-icon-wrapper">
          <Gift size={26} />
        </div>
        <h3 className="gift-title">Mesa de Regalos</h3>
        <p className="gift-message">{message}</p>
      </div>

      {stores && stores.length > 0 && (
        <div className="gift-stores-list">
          {stores.map((store, idx) => (
            <div key={idx} className="store-card">
              <div className="store-info">
                <span className="store-name">{store.name}</span>
                {store.eventNumber && (
                  <span className="store-event-num">{store.eventNumber}</span>
                )}
              </div>
              {store.link && (
                <a
                  href={store.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="store-link-btn"
                >
                  <span>Ir a la mesa</span>
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {bankDetails && (
        <div className="bank-details-card">
          <div className="bank-header">
            <CreditCard size={18} />
            <span>Datos Bancarios para Transferencia</span>
          </div>

          <div className="bank-info-grid">
            <div className="bank-row">
              <span className="bank-label">Banco:</span>
              <span className="bank-val">{bankDetails.bank}</span>
            </div>
            {bankDetails.beneficiary && (
              <div className="bank-row">
                <span className="bank-label">Titular:</span>
                <span className="bank-val">{bankDetails.beneficiary}</span>
              </div>
            )}
            {bankDetails.concept && (
              <div className="bank-row">
                <span className="bank-label">Concepto:</span>
                <span className="bank-val">{bankDetails.concept}</span>
              </div>
            )}
            <div className="bank-clabe-row">
              <div className="clabe-info">
                <span className="bank-label">Cuenta CLABE:</span>
                <span className="clabe-number">{bankDetails.clabe}</span>
              </div>
              <button
                type="button"
                className="copy-btn"
                onClick={() => copyToClipboard(bankDetails.clabe)}
                title="Copiar CLABE"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-copied" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftTable;
