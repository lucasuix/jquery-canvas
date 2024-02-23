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
        <button id="quadrado"> Quadrado </button>
    </div>

    <div id="custom">
        <input type="range" id="brushSize" min="1" max="100" value="1">
        <input type="color" id="brushColor">
    </div>
    
    <script>
        const canvas = document.querySelector("canvas");
        ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = true;

        const tools = document.getElementById("ferramentas");
        const brushSize = document.getElementById("brushSize");

        window.addEventListener("load", () => {
            //Seta o tamanho do canvas em relação a ele mesmo
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        });

        //ferramentas
        const ferramentas = {
            "lapis": new Pencil(),
            "borracha": new Eraser(),
        };

        const customs = {
            "brush_size": 1,
            "brush_color": "#000"
        };

        //Ferramenta atual
        var ferramenta = "lapis";

        //para trocar qual é a ferramenta atual
        $(tools).on("click", function (e) {
            ferramenta = e.target.id;
        });

        //Para trocar o tamanho da ferramenta
        $(brushSize).on("input", function () {
            console.log(ferramentas[ferramenta].brush_size);
            customs["brush_size"] = $(this).val();
        });
        
        //Para trocar a cor da ferramenta
        $(brushColor).on("input", function () {
            console.log(ferramentas[ferramenta].brush_color);
            customs["brush_color"] = $(this).val();
        });


        //Evento que escuta quando o mouse é pressionado para baixo no canvas
        $(canvas).on('mousedown', function(e) {

            
            ctx.beginPath(); //Retoma o caminho do canvas, ou seja, onde o mouse está é onde começa
            ferramentas[ferramenta].setup(customs["brush_size"], customs["brush_color"]);
            ferramentas[ferramenta].iniciar(ctx);

            // Então significa que é possível desenhar
            $(canvas).on('mousemove', function(e) {
                ferramentas[ferramenta].aplicar(ctx, e);
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
