import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import { ProductModel } from '@app/js/app.types';
import { baseAxios } from '@app/js/services/axiosApi';
import catchError from '@app/js/services/catchError';

export interface ProductImageUploaderRef {
    enabled: () => void;
    disabled: () => void;
}

interface ProductImageUploaderProps {
    productModel: ProductModel;
}

type UploadStatus = 'idle' | 'loading' | 'success' | 'error';

const ProductImageUploader = forwardRef<ProductImageUploaderRef, ProductImageUploaderProps>(
    ({ productModel }, ref) => {
        const [isDisabled, setIsDisabled] = useState<boolean>(false);
        const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
        const [errorMessage, setErrorMessage] = useState<string>('');
        const [selectedFile, setSelectedFile] = useState<File | null>(null);
        const fileInputRef = useRef<HTMLInputElement>(null);

        useImperativeHandle(ref, () => ({
            enabled: () => {
                setIsDisabled(false);
            },
            disabled: () => {
                setIsDisabled(true);
            },
        }));

        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file) {
                setSelectedFile(file);
                setUploadStatus('idle');
                setErrorMessage('');
            }
        };

        const handleUpload = async () => {
            if (!selectedFile) {
                setErrorMessage('Por favor, selecione um arquivo.');
                setUploadStatus('error');
                return;
            }

            setUploadStatus('loading');
            setErrorMessage('');

            const formData = new FormData();
            formData.append('image', selectedFile);

            try {
                await baseAxios.post(`/api/products/${productModel.id}/image`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                setUploadStatus('success');
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } catch (error) {
                const errorMsg = catchError(error);
                setErrorMessage(errorMsg);
                setUploadStatus('error');
            }
        };

        const handleClearFile = () => {
            setSelectedFile(null);
            setUploadStatus('idle');
            setErrorMessage('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };

        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Upload de Imagem do Produto</h5>
                    <p className="card-text text-muted">
                        Produto: <strong>{productModel.name}</strong> (ID: {productModel.id})
                    </p>

                    <div className="mb-3">
                        <label htmlFor="fileInput" className="form-label">
                            Selecione uma imagem
                        </label>
                        <input
                            ref={fileInputRef}
                            id="fileInput"
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isDisabled || uploadStatus === 'loading'}
                        />
                        {selectedFile && (
                            <div className="form-text">
                                Arquivo selecionado: <strong>{selectedFile.name}</strong> (
                                {(selectedFile.size / 1024).toFixed(2)} KB)
                            </div>
                        )}
                    </div>

                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleUpload}
                            disabled={isDisabled || !selectedFile || uploadStatus === 'loading'}
                        >
                            {uploadStatus === 'loading' ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Enviando...
                                </>
                            ) : (
                                'Enviar Imagem'
                            )}
                        </button>

                        {selectedFile && uploadStatus !== 'loading' && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleClearFile}
                                disabled={isDisabled}
                            >
                                Limpar
                            </button>
                        )}
                    </div>

                    {uploadStatus === 'success' && (
                        <div className="alert alert-success mt-3 mb-0" role="alert">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            Imagem enviada com sucesso!
                        </div>
                    )}

                    {uploadStatus === 'error' && errorMessage && (
                        <div className="alert alert-danger mt-3 mb-0" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <strong>Erro:</strong> {errorMessage}
                        </div>
                    )}

                    {isDisabled && (
                        <div className="alert alert-warning mt-3 mb-0" role="alert">
                            <i className="bi bi-lock-fill me-2"></i>
                            Upload desabilitado
                        </div>
                    )}
                </div>
            </div>
        );
    }
);

ProductImageUploader.displayName = 'ProductImageUploader';

export default ProductImageUploader;
