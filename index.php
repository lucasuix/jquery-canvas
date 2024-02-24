<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="./tools.js"></script>
    <style>
        body {
            background-color: black;
        }

        canvas {
            background-color: white;
            display: block;
            margin: auto;
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
        <button id="circulo"> Circulo </button>
        <button id="retangulo"> Retangulo </button>
        <button id="retangulo_fill"> Retangulo Cheio </button>
        <button id="elipse"> Elipse </button>
        <button id="elipse_fill"> Elipse Cheia </button>
        <button id="linha"> Linha </button>
        <button id="undo"> Desfazer </button>
        <button id="redo"> Refazer </button>
    </div>

    <div id="custom">
        <input type="range" id="brushSize" min="1" max="100" value="1">
        <input type="color" id="brushColor">
    </div>
    
    <script>
        const canvas = document.querySelector("canvas");
        ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;

        const ferramentas = document.getElementById("ferramentas");
        const brushSize = document.getElementById("brushSize");

        window.addEventListener("load", () => {
            //Seta o tamanho do canvas em relação a ele mesmo
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        });

        //ferramentas
        const tools = {
            "lapis": new Pencil(),
            "borracha": new Eraser(),
            "retangulo": new Rectangle(),
            "retangulo_fill": new RectangleFill()
        };

        const custom = {
            //Dados gerais
            "brush_size": 1,
            "brush_color": "#000",
            
            //Dados para ferramentas: Retângulo, Linha, Círculo
            "prevX": 0,
            "prevY": 0,
            
            "snapshot": ctx.getImageData(0, 0, canvas.width, canvas.height)
        };

        //Ferramenta atual
        var current_tool = "lapis";

        //para trocar qual é a ferramenta atual
        $(ferramentas).on("click", function (e) { current_tool = e.target.id; });

        //Para trocar o tamanho da ferramenta
        $(brushSize).on("input", function () { custom["brush_size"] = $(this).val(); });
        
        //Para trocar a cor da ferramenta
        $(brushColor).on("input", function () { custom["brush_color"] = $(this).val(); });


        //Evento que escuta quando o mouse é pressionado para baixo no canvas
        $(canvas).on('mousedown', function(e) {

            
            custom["snapshot"] = ctx.getImageData(0, 0, canvas.width, canvas.height); //Como vai ter o botão undo, eu vou precisar disso aqui
            custom["prevX"] = e.offsetX; //Salva as coordenadas de inicio para uso da linha, retangulo, e elipse
            custom["prevY"] = e.offsetY; //
            ctx.beginPath(); //Retoma o caminho do canvas, ou seja, onde o mouse está é onde começa
            
            
            tools[current_tool].setup(custom); //Passo o dicionário como referência para acessar qualquer chave que eu precisar dele, assim não preciso de algum if
            tools[current_tool].iniciar(ctx);

            // Então significa que é possível desenhar
            $(canvas).on('mousemove', function(e) {
                tools[current_tool].aplicar(ctx, e);
            //Isso aqui vai ser diferente dependendo do objeto sabe, pode ser linha, fazer círculo e etc...
            });
        });

        // Quando o usuário leva o mouse para cima, ou seja, solta, os eventos de mouse que precisam
        // do mousemove são desativados e o canvas para de desenhar
        // mas quando ele apertar novamente acionará ali no mousedown
        // o mouse leave também remove o efeito de desenho se o usuário colocar o mouse fora dos limites do canvas
        $(canvas).on('mouseup mouseleave', function(e) {
            $(canvas).off('mousemove');
        });




    </script>
</body>
</html>
