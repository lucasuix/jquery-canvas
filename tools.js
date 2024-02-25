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

    iniciar(ctx) {
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
        console.log(e.offsetX, e.offsetY);
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

    iniciar(ctx) {
        ctx.strokeStyle = this.brush_color;
        ctx.lineWidth = this.brush_size * 3;
        ctx.lineCap = 'round'; //Faz a linha ficar redonda
        ctx.lineJoin = 'round'; //Remove os spikes
    }

    aplicar(ctx, e) {

        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
}

//Retângulo, Elipse e Linha entram nessa categoria
class slidingTools extends Tool {
    
    setup(custom) {
            this.brush_size = custom["brush_size"];
            this.brush_color = custom["brush_color"];
            
            //Para armazenar a posição do mouse, onde é o começo do quadrado
            this.prevX = custom["prevX"];
            this.prevY = custom["prevY"];
            
            //Para armazenar a imagem e impedir que o desenho fique com um retângulo borrando
            this.snapshot = custom["snapshot"];
        }
    
}



class Rectangle extends slidingTools {
    
        iniciar(ctx) {
            ctx.strokeStyle = this.brush_color;
            ctx.lineWidth = this.brush_size;
            
            ctx.lineCap = 'butt'; //Faz as extremidades ficarem pontudas de novo
            ctx.lineJoin = 'miter';
        }
        
        aplicar(ctx, e) {
            
            ctx.putImageData(this.snapshot, 0, 0);
            ctx.strokeRect(e.offsetX, e.offsetY, this.prevX - e.offsetX, this.prevY - e.offsetY);
        }
}


class RectangleFill extends Rectangle {
    
    iniciar(ctx) {
        ctx.strokeStyle = this.brush_color;
        ctx.fillStyle = this.brush_color;
        ctx.lineWidth = this.brush_size;
        
        ctx.lineCap = 'butt'; //Faz as extremidades ficarem pontudas de novo
        ctx.lineJoin = 'miter';
    }
    
    aplicar (ctx, e) {
        ctx.putImageData(this.snapshot, 0, 0);
        ctx.fillRect(e.offsetX, e.offsetY, this.prevX - e.offsetX, this.prevY - e.offsetY);
    }
}


class Ellipse extends slidingTools {
    
    iniciar(ctx) {
        ctx.strokeStyle = this.brush_color;
        ctx.lineWidth = this.brush_size;
        
        //ctx.lineCap = 'butt'; //Faz as extremidades ficarem pontudas de novo
        //ctx.lineJoin = 'miter';
    }
    
    aplicar(ctx, e) {
        ctx.beginPath(); //Nesse caso tem que ter isso pq eu fecho o Path lá embaixo
        ctx.putImageData(this.snapshot, 0, 0);
        
        let radiusx = Math.abs(parseInt((e.offsetX - this.prevX)/2));
        let radiusy = Math.abs(parseInt((e.offsetY - this.prevY)/2));
        let x = parseInt((e.offsetX - this.prevX)/2) + this.prevX;
        let y = parseInt((e.offsetY - this.prevY)/2) + this.prevY;
        
        
        ctx.ellipse(x, y, radiusx, radiusy, 0, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
    }
    
}



class EllipseFill extends Ellipse {
    
    iniciar(ctx) {
        ctx.strokeStyle = this.brush_color;
        ctx.fillStyle = this.brush_color;
        ctx.lineWidth = 1;
                                
        //ctx.lineCap = 'butt'; //Faz as extremidades ficarem pontudas de novo
        //ctx.lineJoin = 'miter';
    }
    
    aplicar(ctx, e) {
        ctx.beginPath(); //Nesse caso tem que ter isso pq eu fecho o Path lá embaixo
        ctx.putImageData(this.snapshot, 0, 0);
        
        let radiusx = Math.abs(parseInt((e.offsetX - this.prevX)/2));
        let radiusy = Math.abs(parseInt((e.offsetY - this.prevY)/2));
        let x = parseInt((e.offsetX - this.prevX)/2) + this.prevX;
        let y = parseInt((e.offsetY - this.prevY)/2) + this.prevY;
        
        
        ctx.ellipse(x, y, radiusx, radiusy, 0, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
}



class Line extends slidingTools {
    
    
    iniciar(ctx) {
        //Devido a natureza do ctx, quando ocorre uma mudança eu preciso
        //passar para o ctx qual foi essa mudança, isso aqui ocorre no momento d
        //mousedown
        ctx.strokeStyle = this.brush_color;
        ctx.lineWidth = this.brush_size;
        ctx.lineCap = 'round'; //Faz a linha ficar redonda
        ctx.lineJoin = 'round'; //Remove os spikes
    }
    
    
    aplicar(ctx, e) {
        ctx.beginPath();//Nesse caso também foi necessário o beginPath
        ctx.putImageData(this.snapshot, 0, 0);

        ctx.moveTo(this.prevX, this.prevY); //Ponto de origem é fixo
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
    
    
}
