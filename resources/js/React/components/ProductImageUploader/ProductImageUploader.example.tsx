import React, { useRef } from 'react';
import ProductImageUploader, { ProductImageUploaderRef } from './ProductImageUploader';
import { ProductModel } from '@app/js/app.types';

/**
 * Exemplo de uso do componente ProductImageUploader
 * 
 * Este arquivo demonstra como utilizar o componente de upload de imagens
 * com controle imperativo através de ref.
 */

export default function ProductImageUploaderExample() {
    const uploaderRef = useRef<ProductImageUploaderRef>(null);

    // Exemplo de produto
    const exampleProduct: ProductModel = {
        id: 1,
        name: 'Notebook Dell',
        price_times_thousand: 3500000,
        created_at: new Date(),
        updated_at: new Date(),
    };

    const handleEnableUploader = () => {
        uploaderRef.current?.enabled();
        console.log('Upload habilitado');
    };

    const handleDisableUploader = () => {
        uploaderRef.current?.disabled();
        console.log('Upload desabilitado');
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Exemplo de Upload de Imagem de Produto</h2>

            {/* Botões de controle */}
            <div className="mb-3">
                <button 
                    type="button" 
                    className="btn btn-success me-2"
                    onClick={handleEnableUploader}
                >
                    Habilitar Upload
                </button>
                <button 
                    type="button" 
                    className="btn btn-warning"
                    onClick={handleDisableUploader}
                >
                    Desabilitar Upload
                </button>
            </div>

            {/* Componente de Upload */}
            <ProductImageUploader 
                ref={uploaderRef}
                productModel={exampleProduct}
            />

            {/* Instruções */}
            <div className="alert alert-info mt-4">
                <h5>Instruções de uso:</h5>
                <ul className="mb-0">
                    <li>Use os botões acima para habilitar/desabilitar o upload dinamicamente</li>
                    <li>Selecione uma imagem usando o campo de arquivo</li>
                    <li>Clique em "Enviar Imagem" para fazer o upload</li>
                    <li>O upload é feito via FormData para a rota: <code>POST /api/products/:id/image</code></li>
                </ul>
            </div>
        </div>
    );
}
