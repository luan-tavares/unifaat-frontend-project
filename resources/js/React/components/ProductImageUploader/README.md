# ProductImageUploader Component

Componente React para upload de imagens de produtos com controle imperativo via `useImperativeHandle`.

## 📋 Descrição

O `ProductImageUploader` é um componente reutilizável que permite o upload de imagens associadas a produtos específicos. Ele utiliza `forwardRef` e `useImperativeHandle` para expor métodos que podem ser controlados imperativamente pelo componente pai.

## 🎯 Características

- ✅ Controle imperativo via referência (ref)
- ✅ Upload via FormData para a API REST
- ✅ Feedback visual de estados (idle, loading, success, error, disabled)
- ✅ Estilização completa com Bootstrap
- ✅ TypeScript com tipagem forte
- ✅ Validação de arquivo selecionado
- ✅ Limpeza de formulário após sucesso

## 📦 Localização

```
./resources/js/React/components/ProductImageUploader/ProductImageUploader.tsx
```

## 🔧 API do Componente

### Props

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `productModel` | `ProductModel` | ✅ | Objeto do produto ao qual a imagem será associada |

### Ref Methods (useImperativeHandle)

| Método | Descrição |
|--------|-----------|
| `enabled()` | Habilita o componente, permitindo upload de arquivos |
| `disabled()` | Desabilita o componente, bloqueando upload de arquivos |

### Interface da Ref

```typescript
export interface ProductImageUploaderRef {
    enabled: () => void;
    disabled: () => void;
}
```

## 📡 Endpoint da API

O componente faz upload para o seguinte endpoint:

```
POST /api/products/:id/image
```

Onde `:id` é o ID do produto fornecido via prop `productModel.id`.

### Request

- **Content-Type**: `multipart/form-data`
- **Body**: FormData com campo `image` contendo o arquivo

## 💻 Como Usar

### Exemplo Básico

```tsx
import React, { useRef } from 'react';
import ProductImageUploader, { ProductImageUploaderRef } from './ProductImageUploader';
import { ProductModel } from '@app/js/app.types';

function MyComponent() {
    const uploaderRef = useRef<ProductImageUploaderRef>(null);

    const product: ProductModel = {
        id: 1,
        name: 'Notebook Dell',
        price_times_thousand: 3500000,
        created_at: new Date(),
        updated_at: new Date(),
    };

    return (
        <ProductImageUploader 
            ref={uploaderRef}
            productModel={product}
        />
    );
}
```

### Exemplo com Controle Imperativo

```tsx
import React, { useRef } from 'react';
import ProductImageUploader, { ProductImageUploaderRef } from './ProductImageUploader';

function ProductEditForm() {
    const uploaderRef = useRef<ProductImageUploaderRef>(null);

    const handleFormValidation = (isValid: boolean) => {
        if (isValid) {
            uploaderRef.current?.enabled();
        } else {
            uploaderRef.current?.disabled();
        }
    };

    return (
        <div>
            {/* Outros campos do formulário */}
            
            <ProductImageUploader 
                ref={uploaderRef}
                productModel={product}
            />
            
            <button onClick={() => handleFormValidation(true)}>
                Habilitar Upload
            </button>
            <button onClick={() => handleFormValidation(false)}>
                Desabilitar Upload
            </button>
        </div>
    );
}
```

## 🎨 Estados Visuais

O componente exibe diferentes feedbacks visuais:

### 1. Estado Idle (Padrão)
- Input de arquivo habilitado
- Botão de envio disponível (se arquivo selecionado)

### 2. Estado Loading (Enviando)
- Spinner de loading
- Texto "Enviando..."
- Controles desabilitados

### 3. Estado Success (Sucesso)
- Alert verde do Bootstrap
- Mensagem: "Imagem enviada com sucesso!"
- Formulário limpo automaticamente

### 4. Estado Error (Erro)
- Alert vermelho do Bootstrap
- Mensagem de erro detalhada
- Input permanece disponível para nova tentativa

### 5. Estado Disabled (Desabilitado)
- Alert amarelo do Bootstrap
- Mensagem: "Upload desabilitado"
- Todos os controles desabilitados

## 🔐 Requisitos

- React 18+
- TypeScript
- Axios (via `baseAxios` do projeto)
- Bootstrap 5+ (classes CSS)
- API backend configurada com a rota de upload

## 📝 Notas Importantes

1. O componente limpa automaticamente o input de arquivo após upload bem-sucedido
2. Exibe o tamanho do arquivo selecionado em KB
3. Aceita apenas arquivos de imagem (via `accept="image/*"`)
4. Utiliza o serviço `catchError` do projeto para tratamento de erros
5. O controle imperativo permite que o componente pai determine quando o upload está disponível

## 🔄 Fluxo de Uso Típico

1. Usuário seleciona um arquivo de imagem
2. Componente valida a seleção
3. Usuário clica em "Enviar Imagem"
4. Estado muda para "loading"
5. FormData é enviado via POST
6. Em caso de sucesso:
   - Exibe mensagem de sucesso
   - Limpa o formulário
7. Em caso de erro:
   - Exibe mensagem de erro
   - Permite nova tentativa

## 🛠️ Manutenção e Extensões

Para estender o componente, considere:

- Adicionar preview da imagem antes do upload
- Implementar drag-and-drop
- Adicionar validação de tamanho/formato
- Suportar múltiplos arquivos
- Adicionar progresso de upload (com axios onUploadProgress)
- Implementar crop/resize de imagem

## 📄 Licença

Este componente faz parte do projeto unifaat-frontend-project.
