import { useRef, useState } from "react";
import ProductImageUploader, { ProductImageUploaderRef } from "@app/js/React/components/ProductImageUploader";
import { ProductModel } from "@app/js/app.types";

export default function ProductImageUploaderTest() {
    const uploaderRef = useRef<ProductImageUploaderRef>(null);
    const [isEnabled, setIsEnabled] = useState(true);

    // Produto de exemplo para teste
    const testProduct: ProductModel = {
        id: 1,
        name: 'Notebook Dell Inspiron 15',
        price_times_thousand: 3500000,
        created_at: new Date(),
        updated_at: new Date(),
    };

    const handleEnable = () => {
        uploaderRef.current?.enabled();
        setIsEnabled(true);
    };

    const handleDisable = () => {
        uploaderRef.current?.disabled();
        setIsEnabled(false);
    };

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-lg-8 mx-auto">
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h1 className="display-5 fw-bold mb-3">
                            <i className="bi bi-cloud-upload me-2"></i>
                            Teste do ProductImageUploader
                        </h1>
                        <p className="lead text-muted">
                            Componente de upload com controle imperativo via ref
                        </p>
                    </div>

                    {/* Controles */}
                    <div className="card mb-4 border-0 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title mb-3">
                                <i className="bi bi-sliders me-2"></i>
                                Controles Imperativos
                            </h5>
                            <p className="card-text text-muted small mb-3">
                                Use os botões abaixo para controlar o componente via ref:
                            </p>
                            <div className="d-flex gap-2 flex-wrap">
                                <button 
                                    type="button" 
                                    className={`btn ${isEnabled ? 'btn-outline-success' : 'btn-success'}`}
                                    onClick={handleEnable}
                                    disabled={isEnabled}
                                >
                                    <i className="bi bi-unlock-fill me-2"></i>
                                    Habilitar Upload
                                </button>
                                <button 
                                    type="button" 
                                    className={`btn ${!isEnabled ? 'btn-outline-warning' : 'btn-warning'}`}
                                    onClick={handleDisable}
                                    disabled={!isEnabled}
                                >
                                    <i className="bi bi-lock-fill me-2"></i>
                                    Desabilitar Upload
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Componente de Upload */}
                    <ProductImageUploader 
                        ref={uploaderRef}
                        productModel={testProduct}
                    />

                    {/* Informações de Teste */}
                    <div className="alert alert-info mt-4">
                        <h6 className="alert-heading">
                            <i className="bi bi-info-circle-fill me-2"></i>
                            Instruções de Teste
                        </h6>
                        <hr />
                        <ul className="mb-0 small">
                            <li>O componente está configurado para o produto: <strong>{testProduct.name}</strong></li>
                            <li>Endpoint de upload: <code>POST /api/products/{testProduct.id}/image</code></li>
                            <li>Use os botões de controle acima para habilitar/desabilitar dinamicamente</li>
                            <li>Selecione uma imagem e clique em "Enviar Imagem"</li>
                            <li>Observe o feedback visual em cada estado (loading, success, error)</li>
                        </ul>
                    </div>

                    {/* Informações Técnicas */}
                    <div className="card mt-4 border-0 bg-light">
                        <div className="card-body">
                            <h6 className="card-title">
                                <i className="bi bi-code-square me-2"></i>
                                Detalhes Técnicos
                            </h6>
                            <dl className="row mb-0 small">
                                <dt className="col-sm-4">Componente:</dt>
                                <dd className="col-sm-8"><code>ProductImageUploader</code></dd>
                                
                                <dt className="col-sm-4">Props:</dt>
                                <dd className="col-sm-8"><code>productModel: ProductModel</code></dd>
                                
                                <dt className="col-sm-4">Ref Methods:</dt>
                                <dd className="col-sm-8">
                                    <code>enabled()</code>, <code>disabled()</code>
                                </dd>
                                
                                <dt className="col-sm-4">Upload Type:</dt>
                                <dd className="col-sm-8"><code>multipart/form-data</code></dd>
                                
                                <dt className="col-sm-4">Estado Atual:</dt>
                                <dd className="col-sm-8">
                                    <span className={`badge ${isEnabled ? 'bg-success' : 'bg-warning'}`}>
                                        {isEnabled ? 'Habilitado' : 'Desabilitado'}
                                    </span>
                                </dd>
                            </dl>
                        </div>
                    </div>

                    {/* Status da API */}
                    <div className="alert alert-warning mt-4">
                        <h6 className="alert-heading">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            Nota sobre o Backend
                        </h6>
                        <p className="mb-0 small">
                            Para o upload funcionar completamente, certifique-se de que a rota 
                            <code className="mx-1">POST /api/products/:id/image</code> 
                            esteja implementada no backend e aceitando 
                            <code className="mx-1">multipart/form-data</code> 
                            com o campo <code>image</code>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
