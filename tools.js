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
    
    comparePixels(current, new_color) { //Retorna True se as cores forem iguais, retorna False se as cores forem diferentes
        
        //1º do tipo array, 2º do tipo dicionário
        return (current[0] == new_color.r &&
                current[1] == new_color.g &&
                current[2] == new_color.b);
        
    }


    //Selected color já está no tipo dicionário
    verifyColor(x, y, target_color, selected_color, ctx) {
        
        let current_color = ctx.getImageData(x,y,1,1).data; //Cor do pixel em questão
        
        //Verifico se é o mesmo que a cor que eu já tenho (então não preciso pintar e retorno)
        if (this.comparePixels(current_color, selected_color) || 
            x <= 0 || y <= 0 ||
            x >= this.canvas_size["width"] || y >= this.canvas_size["height"]) return false;
        
        //Se for diferente da cor que é meu alvo (a cor da área que eu quero pintar, retorno falso)
        if (! this.comparePixels(current_color, target_color)) return false; 

        return true;

    }


    recursiveFill(x, y, target_color, selected_color, ctx, new_pixel) {

        if (! this.verifyColor(x, y, target_color, selected_color, ctx)) return;
        ctx.putImageData(new_pixel, x, y);

        this.recursiveFill(x + 1, y, target_color, selected_color, ctx, new_pixel);
        this.recursiveFill(x - 1, y, target_color, selected_color, ctx, new_pixel);
        this.recursiveFill(x, y + 1, target_color, selected_color, ctx, new_pixel);
        this.recursiveFill(x, y - 1, target_color, selected_color, ctx, new_pixel);

        return; 
    }
    
    
    floodFill(x, y, target_color, selected_color, ctx, new_pixel) {
        
        //Se ocorrer um dos casos de exceção do verifyColor retorna imediatamente (cliquei em um pixel que tem a mesma cor que eu selecionei)
        if (! this.verifyColor(x, y, target_color, selected_color, ctx)) return;
        ctx.putImageData(new_pixel, x, y);

        let q = [[x,y]]; //
        let step = 3;
        let square_side = (step*2) - 1;
        //let p = [[x,y]];
        ctx.fillStyle = this.brush_color;

        do {
            // Aplico a ideia aqui, não vou usar o stack, mas um queue para ir armazenando pixels e pegando sempre o primeiro.
            x = q[0][0];
            y = q[0][1];

            if(this.verifyColor(x + step, y, target_color, selected_color, ctx)) {
                ctx.putImageData(new_pixel, x + step, y);
                ctx.fillRect(x - (step - 1), y - (step - 1), square_side, square_side);
                q.push([x + step, y]);
                //p.push([x + 4, y]);
            }
            if(this.verifyColor(x - step, y, target_color, selected_color, ctx)) {
                ctx.putImageData(new_pixel, x - step, y);
                ctx.fillRect(x - (step - 1), y - (step - 1), square_side, square_side);
                q.push([x - step, y]);
                //p.push([x - 4, y]);
            }
            if(this.verifyColor(x, y + step, target_color, selected_color, ctx)) {
                ctx.putImageData(new_pixel, x, y + step);
                ctx.fillRect(x - (step - 1), y - (step - 1), square_side, square_side);
                q.push([x, y + step]);
                //p.push([x, y + 4]);
            }
            if(this.verifyColor(x, y - step, target_color, selected_color, ctx)) {
                ctx.putImageData(new_pixel, x, y - step);
                ctx.fillRect(x - (step - 1), y - (step - 1), square_side, square_side);
                q.push([x, y - step]);
                //p.push([x, y - 4]);
            }

            //Jogar as coordenadas que esbarraram em algum lugar e aplicar o recursivo nelas
            //Ou seja, quando o pivô esbarrar em alguma cor que não é a cor alvo,
            //Ou em algum lugar que está fora dos limites do canvas, aplica o recursivo

            q.shift();


        } while(q.length > 0);

        
        //Se for aplicar isso, vamos ter alguns problemas: o Tamanho mínimo do pincel tem que ser 4
        // -> Se tiver um valor menor que 4, a tinta pode acabar pulando ela e pintando o lado externo se tiver a mesma cor do lado interno
        // MAS FUNCIONA DE QUALQUER MANEIRA, ENTRETANTO O VALOR DO TAMANHO DO PINCEL TEM QUE SER MAIOR QUE ESSES SALTOS (NO CASO 4)
        // do {

        //     x = p[0][0];
        //     y = p[0][1];

        //     ctx.fillStyle = this.brush_color;
        //     ctx.fillRect(x - 2, y - 2, 4, 4);

        //     p.shift();


        // } while(p.length > 0);
        

        return;
    }
  
        
    // Aqui de fato é onde a mágica acontece, a aplicação da ferramenta em um clique único
    iniciar(ctx, e) {
        
        let target_pixel = ctx.getImageData(e.offsetX, e.offsetY, 1, 1).data; //Cor atual onde foi selecionado e que será comparado
        let selected_color = this.hexToRgb(this.brush_color); //Cor selecionada mas em formato RGB
        
        //Pixel com a cor nova para subsituir os pixels antigos
        let pixelData = ctx.createImageData(1, 1);
        
        pixelData.data[0] = selected_color.r; // Vermelho
        pixelData.data[1] = selected_color.g; // Verde
        pixelData.data[2] = selected_color.b; // Azul
        pixelData.data[3] = 255; // Opacidade (alfa)
        
        let target_color = {
            r: target_pixel[0],
            g: target_pixel[1],
            b: target_pixel[2],
        };
        
        
        this.floodFill(e.offsetX, e.offsetY, target_color, selected_color, ctx, pixelData);
        
        //Cor desejada nós já sabemos, é this.brush_color, mas está no formato #xxxxxx
        //data vem em um array: pixel_color[0] -> R; pixel_color[1] -> G; pixel_color[2] -> B, pixel_color[4] -> nível de transparência
        
    }
    
    aplicar(ctx, e) { return; } //Como o bucket não é uma ferramenta de aplicação constante, tentar aplicar com ele deslizando simplesmente retorna imediatamente todas as chamadas da função.
    
}
