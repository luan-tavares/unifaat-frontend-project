# 🧪 Guia de Teste do ProductImageUploader

## ✅ Arquivos Criados para Teste

### 1. Página de Teste
- **Arquivo**: `resources/js/React/Pages/ProductImageUploaderTest/ProductImageUploaderTest.tsx`
- **Descrição**: Página completa de teste do componente com interface visual

### 2. View EJS
- **Arquivo**: `resources/views/upload-test.ejs`
- **Descrição**: Template EJS que renderiza a página de teste

### 3. Controller
- **Arquivo**: `app/Http/Controllers/ViewUploadTestController.js`
- **Descrição**: Controller que serve a view de teste

### 4. Rota
- **Arquivo**: `routes/web.js`
- **Adicionado**: `GET /upload-test` (com autenticação JWT)

## 🚀 Como Testar

### Passo 1: Acesse a página de teste
```
http://localhost:8080/upload-test
```

### Passo 2: Faça login
Se não estiver autenticado, você será redirecionado para o login (JwtVerifyViewMiddleware).

### Passo 3: Teste o componente

#### A. Controle Imperativo
1. Clique em **"Desabilitar Upload"**
   - ✅ Componente deve mostrar alert amarelo
   - ✅ Input e botões devem ficar desabilitados

2. Clique em **"Habilitar Upload"**
   - ✅ Alert amarelo deve sumir
   - ✅ Controles devem voltar a funcionar

#### B. Upload de Arquivo
1. Clique em **"Selecione uma imagem"**
2. Escolha um arquivo de imagem do seu computador
3. Verifique:
   - ✅ Nome do arquivo aparece
   - ✅ Tamanho em KB é exibido
   - ✅ Botão "Enviar Imagem" fica habilitado
   - ✅ Botão "Limpar" aparece

4. Clique em **"Enviar Imagem"**
   - ✅ Botão muda para "Enviando..." com spinner
   - ✅ Controles ficam desabilitados durante upload

#### C. Resultado do Upload

**Se o backend estiver implementado:**
- ✅ Alert verde "Imagem enviada com sucesso!"
- ✅ Formulário é limpo automaticamente

**Se o backend NÃO estiver implementado:**
- ✅ Alert vermelho com mensagem de erro
- ✅ Arquivo permanece selecionado para nova tentativa

## 🔧 Implementar Backend (Opcional)

Para testar o upload completo, implemente a rota no backend:

### Rota Necessária
```javascript
POST /api/products/:id/image
```

### Exemplo de Implementação (Node.js + Express + Multer)

```javascript
import multer from 'multer';
import path from 'path';

// Configurar storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'storage/images/products/');
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = allowedTypes.test(file.mimetype);
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Apenas imagens são permitidas!'));
    }
});

// Rota
router.post('/api/products/:id/image', 
    JwtVerifyApiMiddleware, 
    upload.single('image'), 
    async (req, res) => {
        try {
            const productId = req.params.id;
            const file = req.file;
            
            if (!file) {
                return res.status(400).json({ error: 'Nenhum arquivo enviado' });
            }

            // Salvar referência no banco de dados
            // await ProductImageModel.create({
            //     product_id: productId,
            //     filename: file.filename,
            //     path: file.path,
            //     mimetype: file.mimetype,
            //     size: file.size
            // });

            res.json({ 
                success: true,
                message: 'Imagem enviada com sucesso!',
                file: {
                    filename: file.filename,
                    size: file.size
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);
```

## 📋 Checklist de Testes

### Funcionalidades Básicas
- [ ] Página carrega corretamente
- [ ] Informações do produto são exibidas
- [ ] Input de arquivo está visível
- [ ] Botão "Enviar Imagem" inicia desabilitado

### Seleção de Arquivo
- [ ] Consegue abrir seletor de arquivos
- [ ] Nome do arquivo é exibido após seleção
- [ ] Tamanho do arquivo em KB é mostrado
- [ ] Botão "Enviar Imagem" fica habilitado
- [ ] Botão "Limpar" aparece

### Botão Limpar
- [ ] Remove arquivo selecionado
- [ ] Esconde informações do arquivo
- [ ] Desabilita botão "Enviar Imagem"
- [ ] Esconde botão "Limpar"

### Controle via Ref - Desabilitar
- [ ] Botão "Desabilitar Upload" funciona
- [ ] Alert amarelo aparece
- [ ] Input de arquivo fica desabilitado
- [ ] Botão "Enviar Imagem" fica desabilitado
- [ ] Botão "Limpar" fica desabilitado

### Controle via Ref - Habilitar
- [ ] Botão "Habilitar Upload" funciona
- [ ] Alert amarelo desaparece
- [ ] Controles voltam ao normal

### Upload - Estado Loading
- [ ] Botão muda para "Enviando..."
- [ ] Spinner aparece
- [ ] Todos os controles ficam desabilitados
- [ ] Botões de controle ficam desabilitados

### Upload - Sucesso (com backend)
- [ ] Alert verde aparece
- [ ] Mensagem "Imagem enviada com sucesso!"
- [ ] Formulário é limpo automaticamente
- [ ] Input volta ao estado inicial

### Upload - Erro (sem backend)
- [ ] Alert vermelho aparece
- [ ] Mensagem de erro é exibida
- [ ] Arquivo permanece selecionado
- [ ] Pode tentar novamente

### Integração
- [ ] Múltiplos uploads consecutivos funcionam
- [ ] Alternar entre habilitar/desabilitar funciona
- [ ] Limpar e selecionar novo arquivo funciona

## 🎯 Comportamento Esperado

### Estados do Componente

1. **Idle (Padrão)**
   - Input habilitado
   - Sem arquivo selecionado
   - Botão enviar desabilitado

2. **File Selected (Arquivo Selecionado)**
   - Nome e tamanho exibidos
   - Botão enviar habilitado
   - Botão limpar visível

3. **Loading (Enviando)**
   - Spinner visível
   - Texto "Enviando..."
   - Todos os controles desabilitados

4. **Success (Sucesso)**
   - Alert verde
   - Formulário limpo
   - Volta ao estado Idle

5. **Error (Erro)**
   - Alert vermelho
   - Mensagem de erro
   - Arquivo ainda selecionado

6. **Disabled (Desabilitado)**
   - Alert amarelo
   - Todos os controles desabilitados
   - Não aceita interação

## 📸 Screenshots Esperados

A página de teste deve mostrar:
- ✅ Header com título e descrição
- ✅ Card com botões de controle
- ✅ Componente ProductImageUploader
- ✅ Alert informativo com instruções
- ✅ Card com detalhes técnicos
- ✅ Alert sobre backend

## 🐛 Possíveis Problemas

### Erro 404 na rota
**Solução**: Reinicie o servidor após adicionar a nova rota

### Erro de autenticação
**Solução**: Faça login primeiro em `/users` ou `/products`

### Upload retorna erro
**Esperado**: Rota do backend ainda não existe. Implemente conforme exemplo acima.

### Componente não carrega
**Solução**: Verifique se o build do Vite está rodando corretamente

## 🎉 Resultado Final

Se tudo estiver funcionando:
- ✅ Interface visual completa e profissional
- ✅ Controle imperativo funcionando via ref
- ✅ Todos os estados visuais implementados
- ✅ Feedback claro em todas as ações
- ✅ Componente reutilizável e testado

---

**Status**: Pronto para teste! 🚀
**Acesso**: http://localhost:8080/upload-test
