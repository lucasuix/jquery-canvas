class SimpleDo {
    //Classe abstrata para Redo e Undo, mas só permite um voltar e um avançar
    
    //Imagina fazer uma ferramenta de voltar e ir que desse para eu navegar pelas várias partes do desenho, e ir apagando o que eu fiz?
    //Tipo uma árvorem em que os novos galhos são retornos a uma posição original, na qual uma nova ação diferente é feita, e gera uma ramificação
    
    
    constructor(maxsize, canvasState) {
        
        this.maxsize = maxsize; //Tamanho máximo do stack
        this.stack = [canvasState];
        
        this.stackPos = 0; //Onde estou no stack, inicialmente se refere ao tamanho zero
        this.action = false;
    }
    
    
    
    
    
    undo (ctx) { //Conforme vou clicando eu vou voltando
        
        this.stackPos -= 1; //Quando eu clicar, vou avaliar se estou indo para uma posição válida no stack
        
        if (this.stackPos >= 0) {
           
           ctx.putImageData(this.stack[this.stackPos], 0, 0);
           //Habilito a função refazer de novo
            
        }
        else {
            
            this.stackPos += 1; //Se não der certo, eu retorno para a posição que estava antes
            //return false; //E o botão Desfazer fica desabilitado
        
        }
        
    }
    
    
    
    
    
    
    redo (ctx) {
        
        this.stackPos += 1; //Quando eu clicar, vou avaliar se estou indo para uma posição válida no stack
        
        if (this.stackPos < this.stack.length) {
           
           ctx.putImageData(this.stack[this.stackPos], 0, 0);
           //Habilito a função desfazer de novo
            
        }
        else {
            
            this.stackPos -= 1; //Se não der certo, eu retorno para a posição que estava antes
            //return false; //E o botão Refazer fica desabilitado
        
        }
        
    }
    
    
    
    
    
    
    
    pushAction (canvasState) { //Uma ação foi feita no canvas
        
        if (!this.action) return;
        //O mais um é pq o splice começa remover incluindo a própria posição
        this.stack.splice(this.stackPos + 1); //Isso aqui tem que vir primeiro, pois podemos estar iniciando uma nova ação do meio do stack, então removeremos as ações anteriores a partir dali
        //Para que a útima seja mesmo a última que fizemos
        
        //Se o stack atingir o tamanho máximo, eu apago a ação mais antiga
        if (this.stack.length > this.maxsize) this.stack.shift();
        
        //Coloco a ação mais nova
        this.stack.push(canvasState);
        
        //Removo o resto do array se tiver, a partir da posição onde estou
        
        //Vou me movimentando junto com o array, mas não extrapolo o limite
        if(this.stackPos < this.maxsize) this.stackPos += 1;
        
        this.action = false; //Retorna a variável para false, para esperar um clique no canvas para que seja true de novo.
        
    }
    
    
}
