/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Share2, 
  UploadCloud, 
  Trash2, 
  Download, 
  File, 
  FileText, 
  Image as ImageIcon, 
  Film, 
  Music, 
  CheckCircle2, 
  RefreshCw,
  Loader2,
  Copy,
  Check
} from 'lucide-react';
import { ShareScreenProps, SharedFileItem } from '../types';

export const ShareScreen: React.FC<ShareScreenProps> = ({
  sharedFile,
  setSharedFile,
  sharedText = '',
  setSharedText,
  triggerToast,
  theme = 'dark',
  onRefresh,
  isRefreshing = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper file icon by mime type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="text-emerald-400" size={26} />;
    if (mimeType.startsWith('video/')) return <Film className="text-purple-400" size={26} />;
    if (mimeType.startsWith('audio/')) return <Music className="text-amber-400" size={26} />;
    if (mimeType.includes('pdf') || mimeType.includes('text') || mimeType.includes('document')) {
      return <FileText className="text-blue-400" size={26} />;
    }
    return <File className="text-brand-primary" size={26} />;
  };

  // Process chosen file
  const handleProcessFile = (file: File) => {
    // 5MB limit for inline database JSON safety
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      triggerToast('Arquivo muito grande! O limite máximo é de 5MB.');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        setIsUploading(false);
        triggerToast('Erro ao ler arquivo.');
        return;
      }

      const newFileItem: SharedFileItem = {
        id: `share_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        uploadedAt: new Date().toISOString(),
        dataUrl
      };

      // Substitui o anterior (somente 1 arquivo por vez no banco)
      setSharedFile(newFileItem);
      setIsUploading(false);
      triggerToast('Arquivo sincronizado na nuvem!');
    };

    reader.onerror = () => {
      setIsUploading(false);
      triggerToast('Falha ao processar o arquivo.');
    };

    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
    // Reset input so same file can be re-selected if wanted
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Delete file
  const handleDeleteFile = () => {
    setSharedFile(null);
    triggerToast('Arquivo removido.');
  };

  // Download file locally
  const handleDownload = () => {
    if (!sharedFile) return;
    const a = document.createElement('a');
    a.href = sharedFile.dataUrl;
    a.download = sharedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    triggerToast('Download iniciado.');
  };

  // Native share dialog
  const handleNativeShare = async () => {
    if (!sharedFile) return;

    setIsSharing(true);

    try {
      // Convert base64 dataUrl back to a Blob/File
      const response = await fetch(sharedFile.dataUrl);
      const blob = await response.blob();
      const fileToShare = new window.File([blob], sharedFile.name, { type: sharedFile.type || blob.type });

      // Check if navigator.canShare supports files
      if (navigator.canShare && navigator.canShare({ files: [fileToShare] })) {
        await navigator.share({
          files: [fileToShare],
          title: sharedFile.name,
          text: sharedFile.name
        });
        triggerToast('Compartilhamento concluído!');
      } else if (navigator.share) {
        // Fallback: share text / title if files not supported in this context
        await navigator.share({
          title: sharedFile.name,
          text: `Arquivo: ${sharedFile.name} (${formatFileSize(sharedFile.size)})`,
          url: window.location.href
        });
        triggerToast('Informações compartilhadas!');
      } else {
        // Fallback for browsers with no Web Share API
        handleDownload();
        triggerToast('Compartilhamento nativo indisponível. Download iniciado.');
      }
    } catch (err: any) {
      // AbortError is raised when user cancels native sheet
      if (err.name !== 'AbortError') {
        console.warn('Share error, fallback to download:', err);
        handleDownload();
        triggerToast('Não foi possível acionar o compartilhamento. Download realizado.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4 sm:space-y-5 text-left pb-16 sm:pb-8" id="share-screen-container">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        id="share-file-input"
      />

      {/* Upload Box / Trigger Card */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-center transition-all cursor-pointer select-none flex flex-col items-center justify-center gap-2.5 active:scale-[0.99] ${
          isDragging
            ? 'border-brand-primary bg-brand-primary/10'
            : 'border-outline-variant/40 hover:border-brand-primary/60 hover:bg-white/[0.02] bg-bg-surface-low/70'
        }`}
        id="share-dropzone"
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-bg-surface-med border border-outline-variant/40 flex items-center justify-center text-brand-primary shadow-sm shrink-0">
          {isUploading ? (
            <Loader2 size={24} className="animate-spin text-brand-primary" />
          ) : (
            <UploadCloud size={24} strokeWidth={2.2} />
          )}
        </div>

        <div className="space-y-0.5">
          <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-text-high font-display">
            {isUploading 
              ? 'Enviando arquivo...' 
              : sharedFile 
                ? 'Substituir arquivo' 
                : 'Carregar arquivo para envio'}
          </p>
          <p className="text-[11px] text-text-muted">
            <span className="sm:hidden">Toque para selecionar do dispositivo</span>
            <span className="hidden sm:inline">Clique para selecionar ou arraste o arquivo aqui</span>
          </p>
        </div>

        <span className="text-[9px] font-mono font-bold text-text-muted/70 uppercase px-2.5 py-0.5 rounded-full bg-white/5 border border-outline-variant/20">
          Até 5MB • Qualquer extensão
        </span>
      </div>

      {/* Active File Card */}
      {sharedFile && (
        <div 
          className="bg-bg-surface-low border border-brand-primary/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl space-y-4 relative"
          id="active-shared-file-card"
        >
          {/* Header row */}
          <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-white font-display">
                Pronto para Compartilhar
              </span>
            </div>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteFile();
              }}
              className="p-1 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold"
              title="Apagar arquivo"
              id="btn-delete-shared-file"
            >
              <Trash2 size={13} />
              <span className="uppercase tracking-wider">Apagar</span>
            </button>
          </div>

          {/* File details row */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-bg-surface-med border border-outline-variant/40 shrink-0">
              {getFileIcon(sharedFile.type)}
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-white truncate font-mono" title={sharedFile.name}>
                {sharedFile.name}
              </h4>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-text-muted font-mono">
                <span className="px-1.5 py-0.2 rounded bg-white/5 border border-outline-variant/20 text-brand-primary font-bold">
                  {formatFileSize(sharedFile.size)}
                </span>
                <span>•</span>
                <span>
                  {new Date(sharedFile.uploadedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Native Share (Primary) and Download (Secondary) */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              disabled={isSharing}
              onClick={handleNativeShare}
              className="w-full bg-brand-primary hover:brightness-110 active:scale-[0.98] text-black font-display font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 cursor-pointer gold-glow"
              id="btn-native-share-trigger"
            >
              <Share2 size={16} strokeWidth={2.5} />
              <span>{isSharing ? 'Abrindo opções...' : 'Compartilhar no Aparelho'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="w-full bg-bg-surface-med hover:bg-bg-surface-high active:scale-[0.98] border border-outline-variant/30 text-text-high font-display font-bold text-[11px] uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              id="btn-download-shared-file"
            >
              <Download size={14} />
              <span>Baixar Arquivo</span>
            </button>
          </div>
        </div>
      )}

      {/* Caixa de Texto Compartilhado */}
      <div 
        className="bg-bg-surface-low border border-outline-variant/30 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-lg space-y-3"
        id="shared-text-card"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-text-muted font-display">
            Texto / Link
          </span>

          <div className="flex items-center gap-1.5">
            {sharedText && sharedText.trim().length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(sharedText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                    triggerToast('Texto copiado!');
                  }}
                  className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-brand-primary text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                  title="Copiar texto"
                  id="btn-copy-shared-text"
                >
                  {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (setSharedText) setSharedText('');
                    triggerToast('Texto apagado.');
                  }}
                  className="p-1 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 active:scale-95 transition-colors cursor-pointer"
                  title="Limpar texto"
                  id="btn-clear-shared-text"
                >
                  <Trash2 size={13} />
                </button>
              </>
            )}
          </div>
        </div>

        <textarea
          value={sharedText}
          onChange={(e) => {
            if (setSharedText) {
              setSharedText(e.target.value);
            }
          }}
          placeholder="Digite ou cole um texto ou link aqui..."
          rows={5}
          className="w-full bg-bg-surface-med/70 border border-outline-variant/30 rounded-xl p-3 text-xs sm:text-sm text-text-high placeholder:text-text-muted/40 focus:outline-none focus:border-brand-primary/60 transition-colors font-mono resize-y leading-relaxed"
          id="shared-textarea"
        />

        {sharedText && sharedText.length > 0 && (
          <div className="flex justify-between items-center text-[9px] font-mono text-text-muted/60 px-1">
            <span>{sharedText.length} {sharedText.length === 1 ? 'caractere' : 'caracteres'}</span>
            <span className="text-emerald-400/80">• Salvo automaticamente</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareScreen;
