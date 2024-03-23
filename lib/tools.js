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
        ctx.lineWidth = this.brush_size;
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
    

    matchStartColor(pixelPos) {
        let r = this.colorLayer.data[pixelPos];
        let g = this.colorLayer.data[pixelPos + 1];
        let b = this.colorLayer.data[pixelPos + 2];
        return r === this.startR && g === this.startG && b === this.startB;
    }

    colorPixel(pixelPos, selected_color) {
        this.colorLayer.data[pixelPos] = selected_color.r;
        this.colorLayer.data[pixelPos + 1] = selected_color.g;
        this.colorLayer.data[pixelPos + 2] = selected_color.b;
        this.colorLayer.data[pixelPos + 3] = 255;
    }

    //William Malone Algorithm
    floodFill(startX, startY, selected_color, ctx,
        newPos, x, y, pixelPos, reachLeft, reachRight) {

            newPos = this.pixelStack.pop();
            x = newPos[0];
            y = newPos[1];
            //get current pixel position
            pixelPos = (y * this.canvas_size["width"] + x) * 4;
            // Go up as long as the color matches and are inside the canvas
            while (y >= 0 && this.matchStartColor(pixelPos, selected_color)) {
              y--;
              pixelPos -= this.canvas_size["width"] * 4;
            }
            //Don't overextend
            pixelPos += this.canvas_size["width"] * 4;
            y++;
            reachLeft = false;
            reachRight = false;
            // Go down as long as the color matches and in inside the canvas
            while (y < this.canvas_size["height"] && this.matchStartColor(pixelPos, selected_color)) {
              this.colorPixel(pixelPos, selected_color);
              if (x > 0) {
                if (this.matchStartColor(pixelPos - 4, selected_color)) {
                  if (!reachLeft) {
                    //Add pixel to stack
                    this.pixelStack.push([x - 1, y]);
                    reachLeft = true;
                  }
                } else if (reachLeft) {
                  reachLeft = false;
                }
              }
              if (x < this.canvas_size["width"] - 1) {
                if (this.matchStartColor(pixelPos + 4, selected_color)) {
                  if (!reachRight) {
                    //Add pixel to stack
                    this.pixelStack.push([x + 1, y]);
                    reachRight = true;
                  }
                } else if (reachRight) {
                  reachRight = false;
                }
              }
              y++;
              pixelPos += this.canvas_size["width"] * 4;
            }
            //recursive until no more pixels to change
            if (this.pixelStack.length) {
              this.floodFill(startX, startY, selected_color, ctx,
                newPos, x, y, pixelPos, reachLeft, reachRight);
            }
    }

    actionFill(startX, startY, selected_color, ctx) {

        this.colorLayer = ctx.getImageData(
            0,
            0,
            this.canvas_size["width"],
            this.canvas_size["height"]
        );

        let startPos = (startY * this.canvas_size["width"] + startX) * 4;

        //Acredito que pega a cor específica
        this.startR = this.colorLayer.data[startPos];
        this.startG = this.colorLayer.data[startPos + 1];
        this.startB = this.colorLayer.data[startPos + 2];

        if (selected_color.r === this.startR &&
            selected_color.g === this.startG &&
            selected_color.b === this.startB) return;

        this.pixelStack = [[startX,startY]];
        let newPos, x, y, pixelPos, reachLeft, reachRight;

        this.floodFill(startX, startY, selected_color, ctx,
                        newPos, x, y, pixelPos, reachLeft, reachRight);
        
        ctx.putImageData(this.colorLayer, 0, 0);
        

    }
  
        
    // Aqui de fato é onde a mágica acontece, a aplicação da ferramenta em um clique único
    iniciar(ctx, e) {

        let selected_color = this.hexToRgb(this.brush_color); //Cor selecionada mas em formato RGB
        this.actionFill(e.offsetX, e.offsetY, selected_color, ctx);
        
        
    }
    
    aplicar(ctx, e) { return; } //Como o bucket não é uma ferramenta de aplicação constante, tentar aplicar com ele deslizando simplesmente retorna imediatamente todas as chamadas da função.
    
}
