import { NextRequest, NextResponse } from 'next/server';



export async function GET(request: NextRequest) {

  // 1. Obtener el parámetro 'pressure' de la URL

  const searchParams = request.nextUrl.searchParams;

  const pParam = searchParams.get('pressure');



  if (!pParam) {

    return NextResponse.json({ error: "Missing pressure parameter" }, { status: 400 });

  }



  // Convertimos a número (float)

  const P = parseFloat(pParam);



  // 2. Constantes del Diagrama (Según el dibujo)

  const P_min = 0.05;

  const P_max = 10.0;

  

  // Valores de Volumen Específico (v) en P_min (0.05 MPa)

  const v_liq_min = 0.00105;

  const v_vap_min = 30.00;



  // Valores de Volumen Específico (v) en P_max (10 MPa - Punto Crítico)

  const v_critical = 0.0035;

  if (P === P_max) {
    return NextResponse.json({
      specific_volume_liquid: v_critical, // 0.0035 exacto
      specific_volume_vapor: v_critical   // 0.0035 exacto
    });
  }


  // 3. Cálculos de Interpolación Lineal

  // Fórmula: v = v_start + (slope * (P - P_start))

  

  const delta_P = P_max - P_min; // 9.95



  // Pendiente Líquido

  const slope_liq = (v_critical - v_liq_min) / delta_P;

  

  // Pendiente Vapor

  const slope_vap = (v_critical - v_vap_min) / delta_P;



  // Calculamos los volúmenes para la presión recibida (P)

  // Nota: Si P > 10, técnicamente es supercrítico, pero la fórmula seguirá la recta.

  // El reto suele probar valores entre 0.05 y 10.

  

  const specific_volume_liquid = v_liq_min + (slope_liq * (P - P_min));

  const specific_volume_vapor = v_vap_min + (slope_vap * (P - P_min));

  return NextResponse.json({
    specific_volume_liquid: Number(specific_volume_liquid),
    specific_volume_vapor: Number(specific_volume_vapor),
    // AGREGA ESTO TEMPORALMENTE PARA VERLO EN EL NAVEGADOR:
    debug_info: {
        pressure_input: P,
        slope_liq: slope_liq,
        slope_vap: slope_vap,
        delta_total: delta_P,
        delta_calculated: P - P_min
    }
  });
}