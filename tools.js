class Tool {

    constructor(size = 1, color = "#000") {

        this.brush_size = size;
        this.brush_color = color;
    }

    setup(custom) {
        this.brush_size = custom["brush_size"];
        this.brush_color = custom["brush_color"];
    }

    iniciar() {
        throw new Error("Método 'iniciar' deve ser aplicado em subclasses");
    }

    aplicar() {
        throw new Error("Método 'aplicar' deve ser aplicado em subclasses");
    }

}


class Pencil extends Tool {

    constructor(size = 1, color = "#000") {
        super(size, color);
    }

    iniciar() {
        //Devido a natureza do ctx, quando ocorre uma mudança eu preciso
        //passar para o ctx qual foi essa mudança, isso aqui ocorre no momento d
        //mousedown
        ctx.strokeStyle = this.brush_color;
        ctx.lineWidth = this.brush_size;
        ctx.lineCap = 'round'; //Faz a linha ficar redonda
        ctx.lineJoin = 'round'; //Remove os spikes
    }

    aplicar(ctx, e) {

        ctx.lineTo(e.offsetX, e.offsetY);
        console.log(e.offsetX, e.offsetY)
        ctx.stroke();
    }
}

class Eraser extends Tool {

    constructor(size = 1, color = "#fff") {
        super(size, color);
    }

    //Polimorfismo para não redefinir a cor, e a borracha ter sempre a mesma cor
    setup(custom) {
        this.brush_size = custom["brush_size"];
    }

    iniciar() {
        ctx.strokeStyle = this.brush_color;
        ctx.lineWidth = this.brush_size * 3;
    }

    aplicar(ctx, e) {

        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
}



class Rectangle extends Tool {
 
        constructor(size = 1, color = "#000") {
            super(size, color);
        }
        
        setup(custom) {
            this.brush_size = custom["brush_size"];
            this.brush_color = custom["brush_color"];
            
            //Para armazenar a posição do mouse, onde é o começo do quadrado
            this.prevX = custom["prevX"];
            this.prevY = custom["prevY"];
            
            //Para armazenar a imagem e impedir que o desenho fique com um retângulo borrando
            this.snapshot = custom["snapshot"];
        }
    
        iniciar() {
            ctx.strokeStyle = this.brush_color;
            ctx.lineWidth = this.brush_size;
        }
        
        aplicar(ctx, e) {
        
            ctx.putImageData(this.snapshot, 0, 0);
            ctx.strokeRect(e.offsetX, e.offsetY, this.prevX - e.offsetX, this.prevY - e.offsetY);
        }
}
