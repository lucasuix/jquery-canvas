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

    iniciar(ctx, e) {
        //Devido a natureza do ctx, quando ocorre uma mudança eu preciso
        //passar para o ctx qual foi essa mudança, isso aqui ocorre no momento d
        //mousedown
        ctx.strokeStyle = this.brush_color;
        ctx.lineWidth = this.brush_size;
        ctx.lineCap = 'round'; //Faz a linha ficar redonda
        ctx.lineJoin = 'round'; //Remove os spikes
        
        //Permite cliques únicos (pontos)
        ctx.moveTo(e.offsetX, e.offsetY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
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

    iniciar(ctx, e) {
        ctx.strokeStyle = this.brush_color;
        ctx.lineWidth = this.brush_size * 3;
        ctx.lineCap = 'round'; //Faz a linha ficar redonda
        ctx.lineJoin = 'round'; //Remove os spikes
        
        ctx.moveTo(e.offsetX, e.offsetY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
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



class Bucket extends Tool {
    
    setup(custom) {
        this.brush_size = 1; // O tamanho da ferramenta é sempre um pixel independente do que aconteça
        this.brush_color = custom["brush_color"];
        
        this.canvas_size = custom["canvas_size"];
    }
    
    
    rgbToHex(pixel) {
        
        return "#" + ((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2]).toString(16).slice(1);
    }
    
    hexToRgb(hex) {
        // Remover "#" se presente
        hex = hex.replace(/^#/, '');

        // Converter para valores de cor RGB
        var bigint = parseInt(hex, 16);
        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;

        // Retornar valores de cor RGB
        return { r: r, g: g, b: b };
    }
    
    
    
    floodFill(x, y, target_color, selected_color, ctx, new_pixel) {
        
        
        if (this.rgbToHex(ctx.getImageData(x, y, 1, 1).data) == selected_color ||
            x <= 0 || y <= 0 ||
            x > this.canvas_size["width"] || y > this.canvas_size["height"]) { return; }
        
        if (this.rgbToHex(ctx.getImageData(x, y, 1, 1).data) != target_color) { return; }
        
        //Trocando o pixel
        ctx.putImageData(new_pixel, x, y);
        
        this.floodFill(x + 1, y, target_color, selected_color, ctx, new_pixel);
        this.floodFill(x - 1, y, target_color, selected_color, ctx, new_pixel);
        this.floodFill(x, y + 1, target_color, selected_color, ctx, new_pixel);
        this.floodFill(x, y - 1, target_color, selected_color, ctx, new_pixel);
        
        return;
    }
  
        
    // Aqui de fato é onde a mágica acontece, a aplicação da ferramenta em um clique único
    iniciar(ctx, e) {
        
        let pixel = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data; //Cor atual onde foi selecionado e que será comparado
        let new_color = this.hexToRgb(this.brush_color); //Cor selecionada mas em formato RGB
        let aim_color = this.rgbToHex(pixel); //Cor alvo em formato hexadecimal para comparar com a cor da classe que também é uma string hexadecimal
        
        //Pixel com a cor nova para subsituir os pixels antigos
        let pixelData = ctx.createImageData(1, 1);
        
        pixelData.data[0] = new_color.r; // Vermelho
        pixelData.data[1] = new_color.g; // Verde
        pixelData.data[2] = new_color.b; // Azul
        pixelData.data[3] = 255; // Opacidade (alfa)
        
        
        this.floodFill(e.offsetX, e.offsetY, aim_color, this.brush_color, ctx, pixelData);
        
        //Cor desejada nós já sabemos, é this.brush_color, mas está no formato #xxxxxx
        //data vem em um array: pixel_color[0] -> R; pixel_color[1] -> G; pixel_color[2] -> B, pixel_color[4] -> nível de transparência
        
    }
    
    aplicar(ctx, e) { return; } //Como o bucket não é uma ferramenta de aplicação constante, tentar aplicar com ele deslizando simplesmente retorna imediatamente todas as chamadas da função.
    
}
