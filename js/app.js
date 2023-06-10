const botones = document.querySelector('.botones');
const form = document.querySelector('.tickets__form');
const cards = document.querySelector('.container__ticketsCards')
const valores = ['name','surname','email','amount'];

form.addEventListener('click',(e)=>{
    let elemento = document.getElementById(e.target.id)

    elemento.addEventListener('click',()=>{
        removerAlerta(elemento)
    })

    elemento.addEventListener('blur',()=>{
        alertaPlaceholder(elemento)
        validarCampo(elemento)
    })
})

botones.addEventListener('click',(e)=>{
    let elemento = document.getElementById(e.target.id)
    if(elemento.id == 'borrar'){
        form.reset();
        invalidarCampos();
        resetearResumen();
    }
    if(elemento.id == 'resumen'){
        validarFormulario()
    }
})

cards.addEventListener('click',(e)=>{
    let valor = e.target.parentElement
    asignarValor(valor.id)
})

function removerAlerta(elemento){
    if(elemento.classList.contains('alerta')){
            elemento.classList.remove('alerta')
            reiniciarPlaceholder(elemento);
        }
}
function reiniciarPlaceholder(casoBase){
    let caso = casoBase.id
    switch(caso){
        case 'name':
            casoBase.placeholder = 'Nombre';
            break;
        case 'surname':
            casoBase.placeholder = 'Apellido';
            break;
        case 'email':
            casoBase.placeholder = 'Correo@correo.com';
            break;
    }
}
function alertaPlaceholder(elemento){
    if(elemento.value == ''){
        elemento.placeholder = 'Campo obligatorio';
        elemento.classList.add('alerta')
        elemento.required = true;
    }
}
function validarCampo(elemento){
    const criterios = {
        name : 6,
        surname: 4,
        email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        amount: 1,
    }
    valores.forEach(valor=>{
        if(valor==elemento.id){
            switch (typeof criterios[valor]){
                case 'number':
                    if(elemento.value.length >= criterios[valor]){
                        if(!isNaN(elemento.value) && elemento.value >= 1){
                            elemento.dataset.valido = true;
                            eliminarMensaje(elemento);
                            break;
                        }else if(elemento.value <= 0){
                            mostrarMensaje(elemento,criterios[valor])
                            elemento.dataset.valido = false;
                            break;
                        }
                        if(verificarLetras(elemento.value)){
                            elemento.dataset.valido = true;
                            eliminarMensaje(elemento);
                            break;
                        }
                    }
                    mostrarMensaje(elemento,criterios[valor])
                        elemento.dataset.valido = false;
                    break;
                default:
                    if(criterios[valor].test(elemento.value)){
                        elemento.dataset.valido = true;
                        eliminarMensaje(elemento);
                        break;
                    }else{
                        mostrarMensaje(elemento,criterios[valor])
                        elemento.dataset.valido = false;
                        break;
                    }
            }
        }
    })
}
function verificarLetras(valor){
    return /^[A-Za-z]*$/.test(valor);
}
function mostrarMensaje(elemento,criterio){
    let element = elemento.parentElement.children[1];
        switch(elemento.id){
            case 'name':
                element.innerText = `Este campo debe tener ${criterio} o más caracteres, sin espacios, números o caracteres especiales`
            break;
            case 'surname':
                element.innerText = `Este campo debe tener ${criterio} o más caracteres, sin espacios, números o caracteres especiales`
            break;
            case 'amount':
                element.innerText = `Este campo debe ser igual o mayor a ${criterio}`
            break;
            case 'email':
                element.innerText = 'El correo no es valido'
        }

}
function eliminarMensaje(elemento){
    let element = elemento.parentElement.children[1];
    element.innerText = '';
}
function validarFormulario(){
    let valido
    for(let valor of valores){
        let campo = document.getElementById(`${valor}`)
        if(campo.dataset.valido == 'false'){
            return mostrarResumen(campo.dataset.valido);
        }else{
            valido = campo.dataset.valido
        }
    }
    mostrarResumen(valido);
}
function mostrarResumen(boolean){
    let resumen = document.querySelector('.resumen').children[0]
    if(boolean == 'false'){
        resumen.innerText = 'Algunos campos pueden estar vacios o ser incorrectos'
    }else{
        let monto = calcularMonto();
        resumen.innerText = `Total a Pagar: $${monto}`
    }
}
function calcularMonto(){
    let categoria = document.querySelector('#category').value
    let monto = document.querySelector('#amount').value;
    switch (categoria){
        case 'estudiante':
            return 200*monto-(200*monto*.8);
        case 'trainee':
            return 200*monto-(200*monto*.5);
        case 'junior':
            return 200*monto-(200*monto*.15);
        default:
            return monto*200;
    }
}
function invalidarCampos(){
    valores.forEach(valor=>{
        let elemento = document.getElementById(valor)
        elemento.dataset.valido = 'false';
    })
}
function asignarValor(valor){
    let categoria = document.getElementById('category')
    categoria.value = valor
}
function resetearResumen(){
    let resumen = document.querySelector('.resumen').children[0]
        resumen.innerText = `Total a Pagar: $`
}