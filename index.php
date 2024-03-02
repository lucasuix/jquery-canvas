<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="./tools.js"></script>
    <script src="./actions.js"></script>
    <style>
        body {
            background-color: black;
        }

        canvas {
            background-color: white;
            display: block;
            margin: auto;
        }
        
        #brushSize {
            width: 200px;
        }
    </style>
</head>
<body>

    <canvas id="canvas" width="1080px" height="720px">
    </canvas>

    <!-- Opções de formas -->
    <div id="ferramentas">
        <button id="lapis"> Lapis </button>
        <button id="borracha"> Borracha </button>
        <button id="retangulo"> Retangulo </button>
        <button id="retangulo_fill"> Retangulo Cheio </button>
        <button id="elipse"> Elipse </button>
        <button id="elipse_fill"> Elipse Cheia </button>
        <button id="linha"> Linha </button>
        <button id="balde"> Balde </button>
    </div>
    <div id="acoes">
        <button id="undo"> Desfazer </button>
        <button id="redo"> Refazer </button>
        <button id="limpar"> Limpar Desenho </button>
    </div>

    <div id="custom">
        <input type="range" id="brushSize">
        <input type="color" id="brushColor">
    </div>
    
    <script>
        const canvas = document.querySelector("canvas");
        ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.willReadFrequently = true;

        const ferramentas = document.getElementById("ferramentas");
        const brushSize = document.getElementById("brushSize");
        const acoes = document.getElementById("acoes");

        //Evento que ocorre no carregamento da página
        
        window.addEventListener("load", () => {
            //Seta o tamanho do canvas em relação a ele mesmo
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            
            ctx.fillStyle = "#fff"; // Define a cor de fundo como branco
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            //Inicia o deslizante Brushsize e seta os valores de ínicio
            brushSize.value = 5;
            brushSize.min = 1;
            brushSize.max = 100;
            
            //Seta valor de ínicio no seletor de cores
            document.getElementById("brushColor").value = "#000";
        });
        

        //ferramentas
        const tools = {
            "lapis": new Pencil(),
            "borracha": new Eraser(),
            "retangulo": new Rectangle(),
            "retangulo_fill": new RectangleFill(),
            "elipse": new Ellipse(),
            "elipse_fill": new EllipseFill(),
            "linha": new Line(),
            "balde": new Bucket()
        };

        const custom = {
            //Dados gerais
            "brush_size": 5,
            "brush_color": "#000",
            
            //Dados para ferramentas: Retângulo, Linha, Círculo
            "prevX": 0,
            "prevY": 0,
            
            "snapshot": ctx.getImageData(0, 0, canvas.width, canvas.height),
            
            "canvas_size": {
                
                "width": ctx.canvas.width,
                "height": ctx.canvas.height
                
            },
            
            "limpo": true
        };
        
        
        //$("#redo").prop('disabled', false); //Ativo função avançar
        //$("#undo").prop('disabled', true); //Desativo função voltar

        //Ferramenta atual
        var current_tool = "lapis";
        const simpleDo = new SimpleDo(9, ctx.getImageData(0, 0, canvas.width, canvas.height));

        //para trocar qual é a ferramenta atual
        $(ferramentas).on("click", function (e) { current_tool = e.target.id; });

        //Para trocar o tamanho da ferramenta
        $(brushSize).on("input", function () { custom["brush_size"] = $(this).val(); });
        
        //Para trocar a cor da ferramenta
        $(brushColor).on("input", function () { custom["brush_color"] = $(this).val(); });
        
        $(acoes).on("click", function(e) {
            
            acao = e.target.id;
            
            switch (acao) {
                
                case "undo": 
                    simpleDo.undo(ctx);
                    break;
                    
                case "redo": 
                    simpleDo.redo(ctx);
                    break;
                    
                case "limpar":
                
                    //Limpar a tela é uma ação, mas só pode ser realizada uma vez (não faz sentido limpar um desenho que já foi limpo)
                    if (custom["limpo"]) break;
                    
                    //Do contrário realizamos a limpeza
                    ctx.fillStyle = "#fff"; // Define a cor de fundo como branco
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    
                    simpleDo.action = true;
                    custom["limpo"] = true;
                    
                    simpleDo.pushAction(ctx.getImageData(0, 0, canvas.width, canvas.height));
                    break;
                    
                default:
                    break;
                
            }
        
        });

        //Evento que escuta quando o mouse é pressionado para baixo no canvas
        $(canvas).on('mousedown', function(e) {

            //Snapshot para criar efeito de deslize se necessário
            custom["snapshot"] = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            //Dizer ao simpleDo que realmente algo foi feito no desenho
            //Evitar que algo seja adicionado ao stack, sem um clique ter ocorrido na tela
            simpleDo.action = true;
            custom["limpo"] = false; //Se algo foi feito no canvas, então o desenho não está mais limpo
            
            //Ponto inicial
            custom["prevX"] = e.offsetX;
            custom["prevY"] = e.offsetY;
            
            ctx.beginPath(); //Posição inicial do mouse é o ínicio do trajeto
            
            tools[current_tool].setup(custom); //Preferências passadas pela ferramenta
            tools[current_tool].iniciar(ctx, e); //Preferências e funcionamento da ferramenta passado para o canvas 

            // Aplica a ferramenta no canvas
            $(canvas).on('mousemove', function(e) { tools[current_tool].aplicar(ctx, e); });
            
        });

        
        $(canvas).on('mouseup mouseleave', function(e) { $(canvas).off('mousemove'); simpleDo.pushAction(ctx.getImageData(0, 0, canvas.width, canvas.height)); });



    </script>
</body>
</html>
