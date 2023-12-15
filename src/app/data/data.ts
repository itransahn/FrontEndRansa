
const mesesd = () =>{
    return [        
    {
        idMes : '01',
        mes   : "Enero"
    },
    {
        idMes : '02',
        mes   : "Febrero"
    },
    {
        idMes : '03',
        mes   : "Marzo"
    },
    {
        idMes : '04',
        mes   : "Abril"
    },
    {
        idMes : '05',
        mes   : "Mayo"
    },
    {
        idMes : '06',
        mes   : "Junio"
    },
    {
        idMes : '07',
        mes   : "Julio"
    },
    {
        idMes : '08',
        mes   : "Agosto"
    },
    {
        idMes : '09',
        mes   : "Septiembre"
    },
    {
        idMes : '10',
        mes   : "Octubre"
    },
    {
        idMes : '11',
        mes   : "Noviembre"
    },
    {
        idMes : '12',
        mes   : "Diciembre"
    }
    ]
}
const validarVacio = ( cadena?:string) =>{
    if( cadena != 'undefined' ){
        return cadena
      }else{
          return null }
}

export{
    mesesd,
    validarVacio
}