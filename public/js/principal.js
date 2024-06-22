


document.getElementById('toggleButton').addEventListener('click', function() {
    var texto = document.getElementById('formulario');

    var mas = document.getElementById('plus');
    var menos = document.getElementById('minus');
    
    if (texto.style.display === 'none') {

        texto.style.display = 'block';
        mas.style.display = 'none';
        menos.style.display = 'block';

    } else {

        texto.style.display = 'none';
        mas.style.display = 'block';
        menos.style.display = 'none';

    }
    
});