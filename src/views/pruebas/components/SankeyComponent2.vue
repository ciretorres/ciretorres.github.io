<script setup>
import * as d3 from 'd3'
import { sankey } from 'd3-sankey'
import { sankeyLinkHorizontal } from 'd3-sankey'

import { onMounted, ref } from 'vue'

const svgRef = ref('')

const items = {
  nodes: [
    {
      node: 9,
      name: 'Pino',
      id: 'node9',
      color: '#846026',
      description:
        'Este valor se estimó en función del crecimiento anual de biomasa y de la capa de Uso de Suelo y Vegetación, Serie VI de INEGI, 2016. Contempla la productividad anual de los bosques de coníferas, de los cuales se obtiene leña para el uso residencial y otra parte es destinada a la producción forestal nacional y exportaciones autorizadas por SEMARNAT.',
      ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); Uso de Suelo y Vegetación Serie VI de INEGI (2016).',
    },
    {
      node: 10,
      name: 'Encino',
      id: 'node10',
      color: '#f69633',
      description:
        'Este valor se estimó en función del crecimiento anual de biomasa y de la capa de Uso de Suelo y Vegetación, Serie VI de INEGI, 2016. Contempla la productividad anual de los bosques de encino, de los cuales se obtiene carbón vegetal y leña. Asimismo, los encinos son utilizados para distintos productos, reportados en la producción forestal nacional SEMARNAT, 2018.',
      ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); Uso de Suelo y Vegetación Serie VI de INEGI (2016).',
    },
    {
      node: 11,
      name: 'Tropicales 1',
      id: 'node11',
      color: '#a7bd14',
      description:
        'Este valor se estimó en función del crecimiento anual de biomasa y de la capa de Uso de Suelo y Vegetación, Serie VI de INEGI, 2016. Contempla la productividad anual de las especies leñosas en las selvas. De estas especies, se obtienen distintos productos con fines energéticos, como la leña y el carbón vegetal, también, las maderas tropicales son utilizadas para elaboración y exportación de distintos productos reportados en la producción forestal nacional, SEMARNAT, 2018.',
      ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); Uso de Suelo y Vegetación Serie VI de INEGI (2016).',
    },
    {
      node: 12,
      name: 'Matorrales',
      id: 'node12',
      color: '#f95e2c',
      description:
        'Este valor se estimó en función del crecimiento anual de biomasa y de la capa de Uso de Suelo y Vegetación, Serie VI de INEGI, 2016. Contempla la productividad anual de los matorrales. Es importante mencionar que en la literatura no se contempla el uso de esta vegetación con fines energéticos, pero en consultas de expertos nos dicen que este tipo de vegetación se usa como leña y para la producción de carbón vegetal.',
      ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); Uso de Suelo y Vegetación Serie VI de INEGI (2016); Consulta de expertos.',
    },
    {
      node: 7,
      name: 'Aserraderos',
      id: 'node7',
      color: '#999',
      description:
        'El valor para los aserraderos considera la biomasa que proviene principalmente de la productividad de bosques, selvas y árboles frutales, así como la importación de carbón, leña y madera en rollo (SEMARNAT, 2018). La biomasa transformada se transporta al sector industrial como: aserrín y otros, astillas y pellets. Los productos maderables y no maderables son destinados a usos no energéticos.',
      ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
    },
    {
      node: 19,
      name: 'Leña',
      id: 'node20',
      color: '#999',
      description:
        'Se refiere a la madera cortada con instrumentos afilados, en trozos más largos y gruesos que las astillas de madera. Este producto proviene principalmente del manejo de bosques de encino, ecosistemas tropicales y bosques de coníferas. Sus principales usos se encuentran en el sector residencial (cocción y calefacción), comercio e industria (venta de alimentos preparados, calefacción y otros).',
      ref: 'Serrano-Medrano et. al., (2014); Masera et. al., (2012) y BCS/Línea 4',
    },
    {
      node: 5,
      name: 'Importación de carbón y leña',
      id: 'node5',
      color: '#646e12',
      description:
        'Los valores de importación fueron tomados del Anuario Estadístico de la Producción Forestal, elaborado por SEMARNAT en 2018, en donde se reporta la cantidad de carbón y leña que entra al país.',
      ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
    },
    {
      node: 6,
      name: 'Importación de madera en rollo',
      id: 'node6',
      color: '#acb83f',
      description:
        'Los valores de importación fueron tomados del Anuario Estadístico de la Producción Forestal, elaborado por SEMARNAT en 2018, en donde se reporta la cantidad de madera en rollo que entra al país. Estos valores se tomaron en cuenta, ya que al pasar por el aserradero generan residuos que se pueden llegar a convertir en biocombustibles sólidos.',
      ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
    },
    {
      node: 13,
      name: 'Caña',
      id: 'node13',
      color: '#198d26',
      description:
        'Se considera el cultivo de caña por separado del resto de cultivos anuales por contar con registros oficiales de producción y cuantificación de bagazo generado. La cantidad de rastrojo generado fue estimada por modelos de productividad y comparada con los registros oficiales.',
      ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); SIAP (2022)',
    },
    {
      node: 14,
      name: 'Maíz y otros',
      id: 'node14',
      color: '#198d26',
      description:
        'Este valor considera los residuos generados por los cultivos de maíz, trigo y sorgo, que representan el 55% de la producción de cultivos anuales a nivel nacional. La estimación de residuos se generó con mapas de productividad media anual por municipio.',
      ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); SIAP (2022)',
    },
    {
      node: 17,
      name: 'Árboles frutales',
      id: 'node17',
      color: '#d0df15',
      description:
        'Se considera el potencial máximo de 64 PJ/año proveniente de podas anuales de árboles de aguacate, mango, cítricos, nuez, manzana, durazno, uva y guayaba. Se contempla una producción media de 4 toneladas de materia seca de podas por hectárea, y una disponibilidad de biomasa para energía del 60%.',
      ref: 'Tauro et. al., (2018)',
    },
    {
      node: 16,
      name: 'Agave',
      id: 'node16',
      color: '#acc203',
      description:
        'Este valor considera los valores reportados de generación de residuos para los cultivos de bagazo de maguey.',
      ref: 'Valdez-Vazquez, (2010)',
    },
    {
      node: 20,
      name: 'Pino y otras coníferas',
      id: 'node19',
      color: '#999',
      description:
        'Este valor contempla la producción forestal de pino y otras coníferas que son enviadas a las industrias de transformación primaria para la elaboración de diferentes productos forestales y sus derivados. A la producción registrada por SEMARNAT se suma un porcentaje de madera proveniente de los aprovechamientos forestales no reportados.',
      ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
    },
    {
      node: 22,
      name: 'Encino y otras latifoliadas',
      id: 'node22',
      color: '#999',
      description:
        'Este valor contempla la producción forestal de encino y otras latifoliadas que son enviadas a las industrias de transformación primaria para la elaboración de diferentes productos forestales y sus derivados. A la producción registrada por SEMARNAT se suma un porcentaje de madera proveniente de los aprovechamientos forestales no reportados.',
      ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
    },
    {
      node: 23,
      name: 'Hornos de carbón',
      id: 'node23',
      color: '#999',
      description:
        'El porcentaje de participación de la materia prima que llega a los hornos de carbón proviene de mayor a menor medida: encino, tropicales y matorrales. El carbón vegetal que sale de los hornos tiene un uso energético principalmente en el sector residencial, comercial y exportaciones.',
      ref: 'Arias, (2020); consulta de expertos',
    },
    {
      node: 24,
      name: 'Tropicales',
      id: 'node24',
      color: '#999',
      description:
        'Este valor contempla la producción forestal de especies tropicales que son enviadas a las industrias de transformación primaria para la elaboración de diferentes productos forestales y sus derivados. A la producción registrada por SEMARNAT se suma un porcentaje de madera proveniente de los aprovechamientos forestales no reportados.',
      ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
    },
    {
      node: 25,
      name: 'Bagazo',
      id: 'node25',
      color: '#999',
      description:
        'El bagazo incluye los cultivos de agave y caña principalmente. Su principal uso es energético como combustible en las industrias donde se generan los residuos (ingenios azucareros y tequileras).',
      ref: 'BCS/Línea 4; PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018)',
    },
    {
      node: 26,
      name: 'RAC',
      id: 'node26',
      color: '#999',
      description:
        'Los rastrojos o residuos agrícolas de cosecha (RAC) son subproductos derivados de las actividades agrícolas, y se les considera como la porción del cultivo cosechado (hojas, tallos, espigas y brácteas de la mazorca) que queda después de extraer el grano. La producción nacional es de 45 MtMS, provenientes de diez cultivos; entre ellos, los principales son: el maíz, el sorgo, el trigo y la cebada.\n\nEl consumo nacional de rastrojos se estimó en 43.3 millones de toneladas, principalmente para usos no energéticos como insumo alimenticio en el sector pecuario (bovinos, ovinos y caprinos, principalmente). Si bien los rastrojos son empleados principalmente como forraje para el ganado, estos tienen otros usos: se emplean como mejoradores de suelo al dejarlos como cobertura, como materiales de construcción. Por otra parte, está su uso en los fogones tradicionales y a nivel industrial como biocombustibles.',
      ref: 'Reyes-Muro et. al., (2013)',
    },
    {
      node: 28,
      name: 'Olote',
      id: 'node27',
      color: '#999',
      description:
        'Es un residuo o subproducto agrícola que se genera en grandes cantidades en el proceso de separación del grano de la mazorca. Entre los usos del olote que han sido reportados en la literatura se encuentran la aplicación como forraje para rumiantes y soporte para disminuir la erosión en la tierra.',
      ref: 'Tauro et. al., (2018); Córdoba et. al., (2013).',
    },
    {
      node: 29,
      name: 'Carbón vegetal',
      id: 'node29',
      color: '#999',
      description:
        'Biocombustible sólido derivado de la carbonización, la pirólisis o la torrefacción de combustibles forestales. Este producto proviene principalmente del manejo de bosques de encino y zonas tropicales. El carbón vegetal es usado en el sector residencial y comercial, principalmente para la cocción de alimentos.',
      ref: 'Serrano-Medrano et. al., (2014); BCS/Línea 4',
    },
    {
      node: 30,
      name: 'Aserrín',
      id: 'node30',
      color: '#999',
      description:
        'Se refiere a las partículas finas de 1 a 5 mm que se derivan del aserrado de madera, se usa principalmente en pequeñas industrias, como combustible o mezcla para la fabricación de ladrillos, asimismo, tiene una gran cantidad de usos no energéticos, como la fabricación de aglomerados, usos veterinarios, y en diversos comercios es usado para limpieza (carnicerías, productores de aceite, etc).',
      ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
    },
    {
      node: 31,
      name: 'Astillas',
      id: 'node31',
      color: '#999',
      description:
        'Las astillas son trozos de madera de pequeñas dimensiones que quedan después de la generación de productos forestales en la industria del procesamiento de la madera. Asimismo, los pellets son biocombustibles sólidos densificados obtenidos de biomasa pulverizada que se genera en los aserraderos. Pueden tener diferentes usos, entre los cuales destaca, el energético en la industria y usos no energéticos como camas para los animales de las veterinarias.',
      ref: 'BCS/Línea 4; Arias, (2020)',
    },
    {
      node: 32,
      name: 'Otros productos maderables y no maderables',
      id: 'node31',
      color: '#999',
      description:
        'Los otros tipos de productos maderables contemplan materiales leñosos como: escuadría, durmientes, chapa y triplay. Por otro lado, los principales productos no maderables son: resinas, gomas, rizomas, tierra de monte, fibras y ceras. El destino de ambos productos son principalmente para usos no energéticos y exportación.',
      ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
    },
    {
      node: 35,
      name: 'Residencial',
      id: 'node35',
      color: '#999',
      description:
        'Este sector considera el uso de dos biocombustibles sólidos (BCS)*: leña y carbón vegetal. El valor de ambos se consideró a partir de la investigación realizada por (Serrano-Medrano et. al., 2014), en la que se estimó el consumo anual de éstos. Se realizó un análisis detallado del consumo específico* por vivienda y usuarios, así como la saturación de consumidores* de leña y carbón vegetal por tamaño de localidad. Asimismo, la demanda de Pellets es muy baja en el sector residencial para calefacción de ambiente en el Norte de México (<10 toneladas/año) (Arias, 2020).',
      ref: 'Serrano-Medrano et. al., (2014); Arias, (2020)',
    },
    {
      node: 33,
      name: 'Comercio',
      id: 'node33',
      color: '#999',
      description:
        'Descripción: Los valores se obtuvieron a partir del estudio de investigación desarrollado en campo por la Línea 4 del Clúster de BCS. La leña es el principal BCS utilizado en la cocción de alimentos (venta de alimentos preparados, tortillerías, hospedaje) y calefacción de ambiente (oficinas de gobierno y hospedaje), seguida del carbón vegetal (venta de alimentos preparados) (CBCS L-4). Asimismo, se consideraron los valores de carbón vegetal en comercios formales e informales, reportados por (Serrano-Medrano et. al., 2014).',
      ref: 'CBCS L-4; Serrano-Medrano et. al., (2014)',
    },
    {
      node: 34,
      name: 'Industrial',
      id: 'node34',
      color: '#999',
      description:
        'Este sector considera el uso de diferentes tipos de BCS. La leña es el principal BCS utilizado en la pequeña y mediana industria: lácteos, ladrilleras y mezcaleras (CBCS L-4; Masera et. al., 2012). En la gran industria se utilizan principalmente los siguientes BCS: ingenios azucareros (bagazo de caña, astillas), tequileras (bagazo de agave, astillas), cerveceras (astillas) (CBCS L-4; Arias, 2020).',
      ref: 'CBCS L-4; Masera et. al., (2012); Arias, (2020)',
    },
    {
      node: 34,
      name: 'Pellets',
      id: 'node35',
      color: '#999',
      description:
        'Este sector considera el uso de diferentes tipos de BCS. La leña es el principal BCS utilizado en la pequeña y mediana industria: lácteos, ladrilleras y mezcaleras (CBCS L-4; Masera et. al., 2012). En la gran industria se utilizan principalmente los siguientes BCS: ingenios azucareros (bagazo de caña, astillas), tequileras (bagazo de agave, astillas), cerveceras (astillas) (CBCS L-4; Arias, 2020).',
      ref: 'CBCS L-4; Masera et. al., (2012); Arias, (2020)',
    },
    {
      node: 36,
      name: 'Usos no energéticos',
      id: 'node36',
      color: '#999',
      description:
        'Este valor considera los RAC que se utilizan para forraje, incorporación en terrenos agrícolas, camas para el ganado y sustrato en la producción de hongos comestibles. El aserrín se utiliza para la fabricación de aglomerados, usos veterinarios, y en diversos comercios es usado para limpieza (carnicerías, productores de aceite, etc). Los usos no energéticos principales de las astillas y pellets son en camas para los animales de las veterinarias.',
      ref: 'Reyes-Muro et. al., (2013); BCS/Línea 4; Arias, (2020); Consulta de expertos; Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
    },
    {
      node: 8,
      name: 'Exportaciones',
      id: 'node8',
      color: '#999',
      description:
        'Se consideran los valores reportados por el Anuario Estadístico Forestal, SEMARNAT, 2018. Los principales productos exportados son ventanas, puertas, tableros, cajas; asimismo se exporta leña y carbón vegetal.',
      ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
    },
  ],
  links: [
    {
      source: 'Pino',
      target: 'Leña',
      value: 51.7,
      color: '#846026',
    },
    {
      source: 'Pino',
      target: 'Pino y otras coníferas',
      value: 124.9,
      color: '#846026',
    },
    {
      source: 'Encino',
      target: 'Encino y otras latifoliadas',
      value: 129,
      color: '#f69633',
    },
    {
      source: 'Encino',
      target: 'Hornos de carbón',
      value: 47.1,
      color: '#f69633',
    },
    {
      source: 'Encino',
      target: 'Leña',
      value: 103.4,
      color: '#f69633',
    },
    {
      source: 'Tropicales 1',
      target: 'Hornos de carbón',
      value: 4.2,
      color: '#a7bd14',
    },
    {
      source: 'Tropicales 1',
      target: 'Leña',
      value: 77.6,
      color: '#a7bd14',
    },
    {
      source: 'Tropicales 1',
      target: 'Tropicales',
      value: 35.7,
      color: '#a7bd14',
    },
    {
      source: 'Matorrales',
      target: 'Hornos de carbón',
      value: 1.4,
      color: '#f95e2c',
    },
    {
      source: 'Matorrales',
      target: 'Leña',
      value: 25.9,
      color: '#f95e2c',
    },
    {
      source: 'Importación de carbón y leña',
      target: 'Carbón vegetal',
      value: 0.19,
      color: '#646e12',
    },
    {
      source: 'Importación de carbón y leña',
      target: 'Leña',
      value: 0.11,
      color: '#646e12',
    },
    {
      source: 'Importación de madera en rollo',
      target: 'Aserraderos',
      value: 0.32,
      color: '#acb83f',
    },
    {
      source: 'Pino y otras coníferas',
      target: 'Aserraderos',
      value: 83,
      color: '#b6906e',
    },
    {
      source: 'Pino y otras coníferas',
      target: 'Astillas',
      value: 6,
      color: '#b6906e',
    },
    {
      source: 'Pino y otras coníferas',
      target: 'Leña',
      value: 35.9,
      color: '#b6906e',
    },
    {
      source: 'Encino y otras latifoliadas',
      target: 'Aserraderos',
      value: 47.9,
      color: '#b6906e',
    },
    {
      source: 'Encino y otras latifoliadas',
      target: 'Hornos de carbón',
      value: 45.3,
      color: '#b6906e',
    },
    {
      source: 'Encino y otras latifoliadas',
      target: 'Leña',
      value: 34,
      color: '#b6906e',
    },
    {
      source: 'Tropicales',
      target: 'Aserraderos',
      value: 12.9,
      color: '#656c43',
    },
    {
      source: 'Tropicales',
      target: 'Hornos de carbón',
      value: 11.1,
      color: '#656c43',
    },
    {
      source: 'Tropicales',
      target: 'Leña',
      value: 6.7,
      color: '#656c43',
    },
    {
      source: 'Caña',
      target: 'Bagazo',
      value: 52.65,
      color: '#198d26',
    },
    {
      source: 'Maíz y otros',
      target: 'Olote',
      value: 39.6,
      color: '#198e21',
    },
    {
      source: 'Árboles frutales',
      target: 'Aserraderos',
      value: 6.8,
      color: '#d0df15',
    },
    {
      source: 'Árboles frutales',
      target: 'Leña',
      value: 20.3,
      color: '#e9ef7f',
    },
    {
      source: 'Agave',
      target: 'Bagazo',
      value: 22.5,
      color: '#acc203',
    },
    {
      source: 'Hornos de carbón',
      target: 'Carbón vegetal',
      value: 109.1,
      color: '#a04e04',
    },
    {
      source: 'Aserraderos',
      target: 'Aserrín',
      value: 1.2,
      color: '#fb5b29',
    },
    {
      source: 'Aserraderos',
      target: 'Astillas',
      value: 7.7,
      color: '#fc6e46',
    },
    {
      source: 'Aserraderos',
      target: 'Leña',
      value: 31.4,
      color: '#fc6e46',
    },
    {
      source: 'Aserraderos',
      target: 'Otros productos maderables y no maderables',
      value: 110,
      color: '#522007',
    },
    {
      source: 'Leña',
      target: 'Comercio',
      value: 13,
      color: '#d39e93',
    },
    {
      source: 'Leña',
      target: 'Exportaciones',
      value: 2.8,
      color: '#845f29',
    },
    {
      source: 'Leña',
      target: 'Industrial',
      value: 27.4,
      color: '#ef3f11',
    },
    {
      source: 'Leña',
      target: 'Residencial',
      value: 343.8,
      color: '#845f29',
    },
    {
      source: 'Carbón vegetal',
      target: 'Comercio',
      value: 6.3,
      color: '#d39e93',
    },
    {
      source: 'Carbón vegetal',
      target: 'Exportaciones',
      value: 15.7,
      color: '#9b5205',
    },
    {
      source: 'Carbón vegetal',
      target: 'Industrial',
      value: 0.3,
      color: '#f33e03',
    },
    {
      source: 'Carbón vegetal',
      target: 'Residencial',
      value: 87,
      color: '#9b5205',
    },
    {
      source: 'Astillas',
      target: 'Industrial',
      value: 13.7,
      color: '#fb3a04',
    },
    {
      source: 'Aserrín',
      target: 'Pellets',
      value: 9,
      color: '#b05e06',
    },
    {
      source: 'Aserrín',
      target: 'Industrial',
      value: 1.2,
      color: '#b05e06',
    },
    {
      source: 'Pellets',
      target: 'Comercio',
      value: 14,
      color: '#b05e06',
    },
    {
      source: 'Pellets',
      target: 'Residencial',
      value: 13,
      color: '#b05e06',
    },
    {
      source: 'Bagazo',
      target: 'Pellets',
      value: 18,
      color: '#1d8b26',
    },
    {
      source: 'Bagazo',
      target: 'Industrial',
      value: 75.2,
      color: '#1d8b26',
    },
    {
      source: 'Olote',
      target: 'Residencial',
      value: 39.6,
      color: '#198d23',
    },
  ],
}

// const items2 = {
//   nodes: [
//     { node: 9, name: 'Pino', id: 'node9', color: '#846026' },
//     { node: 10, name: 'Encino', id: 'node10', color: '#f69633' },
//     { node: 11, name: 'Tropicales 1', id: 'node11', color: '#a7bd14' },
//     { node: 12, name: 'Matorrales', id: 'node12', color: '#f95e2c' },
//     { node: 7, name: 'Aserradero', id: 'node7', color: '#999' },
//     { node: 19, name: 'Leña', id: 'node20', color: '#999' },
//     {
//       node: 5,
//       name: 'Importación\nde carbón\ny leña',
//       id: 'node5',
//       color: '#646e12',
//     },
//     {
//       node: 6,
//       name: 'Importación\nde madera\nen rollo',
//       id: 'node6',
//       color: '#acb83f',
//     },
//     { node: 13, name: 'Caña', id: 'node13', color: '#198d26' },
//     { node: 14, name: 'Maíz y\notros', id: 'node14', color: '#198d26' },
//     {
//       node: 17,
//       name: 'Árboles\nfrutales',
//       id: 'node17',
//       color: '#d0df15',
//     },
//     { node: 16, name: 'Agave', id: 'node16', color: '#acc203' },
//     {
//       node: 20,
//       name: 'Pino y otras\nconíferas',
//       id: 'node19',
//       color: '#999',
//     },
//     {
//       node: 22,
//       name: 'Encino\ny otras\nlatifoliadas',
//       id: 'node22',
//       color: '#999',
//     },
//     { node: 23, name: 'Hornos de\ncarbón', id: 'node23', color: '#999' },
//     { node: 24, name: 'Tropicales', id: 'node24', color: '#999' },
//     { node: 25, name: 'Bagazo', id: 'node25', color: '#999' },
//     { node: 26, name: 'RAC', id: 'node26', color: '#999' },
//     { node: 28, name: 'Olote', id: 'node27', color: '#999' },
//     { node: 29, name: 'Carbón vegetal', id: 'node29', color: '#999' },
//     { node: 30, name: 'Aserrín y otros', id: 'node30', color: '#999' },
//     {
//       node: 31,
//       name: 'Astillas y\npellets',
//       id: 'node31',
//       color: '#999',
//     },
//     {
//       node: 32,
//       name: 'Otros productos maderables y no maderables',
//       id: 'node31',
//       color: '#999',
//     },
//     { node: 35, name: 'Residencial', id: 'node35', color: '#999' },
//     { node: 33, name: 'Comercio', id: 'node33', color: '#999' },
//     { node: 34, name: 'Industrial', id: 'node34', color: '#999' },
//     {
//       node: 36,
//       name: 'Usos no\nenergéticos',
//       id: 'node36',
//       color: '#999',
//     },
//     { node: 8, name: 'Exportaciones', id: 'node8', color: '#999' },
//   ],
//   links: [
//     { source: 'Pino', target: 'Leña', value: 3.12, color: '#846026' },
//     {
//       source: 'Pino',
//       target: 'Pino y otras\nconíferas',
//       value: 17.25,
//       color: '#846026',
//     },
//     {
//       source: 'Encino',
//       target: 'Encino\ny otras\nlatifoliadas',
//       value: 9.63,
//       color: '#f69633',
//     },
//     {
//       source: 'Encino',
//       target: 'Hornos de\ncarbón',
//       value: 3.13,
//       color: '#f69633',
//     },
//     { source: 'Encino', target: 'Leña', value: 6.24, color: '#f69633' },
//     {
//       source: 'Tropicales 1',
//       target: 'Hornos de\ncarbón',
//       value: 0.59,
//       color: '#a7bd14',
//     },
//     {
//       source: 'Tropicales 1',
//       target: 'Leña',
//       value: 4.68,
//       color: '#adc015',
//     },
//     {
//       source: 'Tropicales 1',
//       target: 'Tropicales',
//       value: 3.14,
//       color: '#adc015',
//     },
//     {
//       source: 'Matorrales',
//       target: 'Hornos de\ncarbón',
//       value: 0.2,
//       color: '#f95e2c',
//     },
//     {
//       source: 'Matorrales',
//       target: 'Leña',
//       value: 0.78,
//       color: '#f95e2c',
//     },
//     {
//       source: 'Importación\nde carbón\ny leña',
//       target: 'Leña',
//       value: 0.01,
//       color: '#646e12',
//     },
//     {
//       source: 'Importación\nde carbón\ny leña',
//       target: 'Carbón vegetal',
//       value: 0.01,
//       color: '#646e12',
//     },
//     {
//       source: 'Importación\nde madera\nen rollo',
//       target: 'Aserradero',
//       value: 0.0175655,
//       color: '#acb83f',
//     },
//     {
//       source: 'Pino y otras\nconíferas',
//       target: 'Aserradero',
//       value: 13.18,
//       color: '#b6906e',
//     },
//     {
//       source: 'Pino y otras\nconíferas',
//       target: 'Astillas y\npellets',
//       value: 1.32,
//       color: '#b6906e',
//     },
//     {
//       source: 'Pino y otras\nconíferas',
//       target: 'Exportaciones',
//       value: 0.02,
//       color: '#b6906e',
//     },
//     {
//       source: 'Pino y otras\nconíferas',
//       target: 'Leña',
//       value: 2.73,
//       color: '#b6906e',
//     },
//     {
//       source: 'Encino\ny otras\nlatifoliadas',
//       target: 'Aserradero',
//       value: 6.93,
//       color: '#b6906e',
//     },
//     {
//       source: 'Encino\ny otras\nlatifoliadas',
//       target: 'Hornos de\ncarbón',
//       value: 1.4,
//       color: '#b6906e',
//     },
//     {
//       source: 'Encino\ny otras\nlatifoliadas',
//       target: 'Leña',
//       value: 1.3,
//       color: '#b6906e',
//     },
//     {
//       source: 'Tropicales',
//       target: 'Aserradero',
//       value: 2.23,
//       color: '#656c43',
//     },
//     {
//       source: 'Tropicales',
//       target: 'Hornos de\ncarbón',
//       value: 0.5,
//       color: '#656c43',
//     },
//     {
//       source: 'Tropicales',
//       target: 'Leña',
//       value: 0.39,
//       color: '#656c43',
//     },
//     {
//       source: 'Tropicales',
//       target: 'Exportaciones',
//       value: 0.02,
//       color: '#656c43',
//     },
//     { source: 'Caña', target: 'RAC', value: 8.4, color: '#198d26' },
//     { source: 'Caña', target: 'Bagazo', value: 7.6, color: '#168f25' },
//     {
//       source: 'Maíz y\notros',
//       target: 'Olote',
//       value: 7,
//       color: '#198e21',
//     },
//     {
//       source: 'Árboles\nfrutales',
//       target: 'Aserradero',
//       value: 1,
//       color: '#d0df15',
//     },
//     {
//       source: 'Árboles\nfrutales',
//       target: 'Leña',
//       value: 0.78,
//       color: '#e9ef7f',
//     },
//     { source: 'Agave', target: 'Bagazo', value: 1.5, color: '#acc203' },
//     {
//       source: 'Hornos de\ncarbón',
//       target: 'Carbón vegetal',
//       value: 7.64,
//       color: '#a04e04',
//     },
//     {
//       source: 'Aserradero',
//       target: 'Aserrín y otros',
//       value: 2.1,
//       color: '#fb5b29',
//     },
//     {
//       source: 'Aserradero',
//       target: 'Astillas y\npellets',
//       value: 2.46,
//       color: '#fc6e46',
//     },
//     {
//       source: 'Aserradero',
//       target: 'Leña',
//       value: 1.46,
//       color: '#fc6e46',
//     },
//     {
//       source: 'Aserradero',
//       target: 'Otros productos maderables y no maderables',
//       value: 15.52,
//       color: '#522007',
//     },
//     {
//       source: 'Aserradero',
//       target: 'Hornos de\ncarbón',
//       value: 1.82,
//       color: '#748116',
//     },
//     { source: 'Leña', target: 'Comercio', value: 0.72, color: '#d39e93' },
//     {
//       source: 'Leña',
//       target: 'Industrial',
//       value: 1.52,
//       color: '#ef3f11',
//     },
//     {
//       source: 'Leña',
//       target: 'Residencial',
//       value: 19.1,
//       color: '#845f29',
//     },
//     {
//       source: 'Leña',
//       target: 'Exportaciones',
//       value: 0.15,
//       color: '#845f29',
//     },
//     {
//       source: 'Carbón vegetal',
//       target: 'Comercio',
//       value: 0.22,
//       color: '#d39e93',
//     },
//     {
//       source: 'Carbón vegetal',
//       target: 'Industrial',
//       value: 3,
//       color: '#f33e03',
//     },
//     {
//       source: 'Carbón vegetal',
//       target: 'Residencial',
//       value: 2.9,
//       color: '#9b5205',
//     },
//     {
//       source: 'Carbón vegetal',
//       target: 'Exportaciones',
//       value: 0.52,
//       color: '#9b5205',
//     },
//     {
//       source: 'Aserrín y otros',
//       target: 'Industrial',
//       value: 1.05,
//       color: '#b05e06',
//     },
//     {
//       source: 'Aserrín y otros',
//       target: 'Usos no\nenergéticos',
//       value: 1.05,
//       color: '#ea4110',
//     },
//     {
//       source: 'Astillas y\npellets',
//       target: 'Industrial',
//       value: 1.39,
//       color: '#fb3a04',
//     },
//     {
//       source: 'Astillas y\npellets',
//       target: 'Usos no\nenergéticos',
//       value: 2.39,
//       color: '#ee4009',
//     },
//     {
//       source: 'Otros productos maderables y no maderables',
//       target: 'Usos no\nenergéticos',
//       value: 14.45,
//       color: '#a7bc17',
//     },
//     {
//       source: 'Otros productos maderables y no maderables',
//       target: 'Exportaciones',
//       value: 1.07,
//       color: '#a7bc17',
//     },
//     {
//       source: 'Bagazo',
//       target: 'Industrial',
//       value: 9.1,
//       color: '#1d8b26',
//     },
//     {
//       source: 'Olote',
//       target: 'Usos no\nenergéticos',
//       value: 3.5,
//       color: '#198d23',
//     },
//     {
//       source: 'Olote',
//       target: 'Residencial',
//       value: 3.5,
//       color: '#198d23',
//     },
//     {
//       source: 'RAC',
//       target: 'Usos no\nenergéticos',
//       value: 8.4,
//       color: '#198d23',
//     },
//   ],
// }

// const items3 = {
//   nodes: [
//     { node: 1, name: 'Producción', id: 'node9', color: '#999' },
//     { node: 2, name: 'Importación', id: 'node10', color: '#999' },
//     { node: 3, name: 'Exportación', id: 'node11', color: '#999' },
//     { node: 7, name: 'Petróleo', id: 'node5', color: '#000000' },
//     { node: 6, name: 'Carbón', id: 'node20', color: '#85200c' },
//     { node: 8, name: 'Condensados', id: 'node6', color: '#f00' },
//     { node: 9, name: 'Gas natural', id: 'node13', color: '#4a86e8' },
//     { node: 10, name: 'Nucleoenergía', id: 'node14', color: '#9900ff' },
//     { node: 11, name: 'Geoenergía', id: 'node17', color: '#783f04' },
//     { node: 12, name: 'Energía eólica', id: 'node16', color: '#0000ff' },
//     { node: 13, name: 'Hidroenergía', id: 'node19', color: '#0ff' },
//     { node: 14, name: 'Bagazo de caña', id: 'node22', color: '#0ff' },
//     { node: 15, name: 'Biogas', id: 'node23', color: '#6d9eeb' },
//     { node: 16, name: 'Energía solar', id: 'node24', color: '#ff0' },
//     { node: 17, name: 'Leña', id: 'node25', color: '#b45f06' },
//     { node: 18, name: 'Otros', id: 'node26', color: '#999' },
//     { node: 20, name: 'Consumo propio', id: 'node29', color: '#999' },
//     { node: 22, name: 'Otros *', id: 'node31', color: '#999' },
//     { node: 25, name: 'Sector industrial', id: 'node33', color: '#999' },
//     { node: 26, name: 'Sector transporte', id: 'node34', color: '#999' },
//     {
//       node: 27,
//       name: 'Sector agropecuario',
//       id: 'node36',
//       color: '#999',
//     },
//     {
//       node: 28,
//       name: 'Sector comercial y servicios',
//       id: 'node8',
//       color: '#999',
//     },
//     { node: 29, name: 'Sector público', id: 'node8', color: '#999' },
//     { node: 30, name: 'Sector residencial', id: 'node8', color: '#999' },
//     { node: 31, name: 'PEMEX Petroquímica', id: 'node8', color: '#999' },
//     {
//       node: 32,
//       name: 'Otras ramas económicas',
//       id: 'node8',
//       color: '#999',
//     },
//     {
//       node: 33,
//       name: 'Hornos y coquizadoras',
//       id: 'node8',
//       color: '#999',
//     },
//     {
//       node: 34,
//       name: 'Refinerías y despuntadoras',
//       id: 'node8',
//       color: '#999',
//     },
//     {
//       node: 35,
//       name: 'Plantas de gas y fraccionadoras',
//       id: 'node8',
//       color: '#999',
//     },
//     {
//       node: 36,
//       name: 'Transferencia interproductos',
//       id: 'node8',
//       color: '#999',
//     },
//     { node: 37, name: 'Coque de carbón', id: 'node8', color: '#cc4125' },
//     {
//       node: 38,
//       name: 'Coque de petróleo',
//       id: 'node8',
//       color: '#000000',
//     },
//     { node: 39, name: 'Combustóleo', id: 'node8', color: '#666666' },
//     { node: 40, name: 'Queroseno', id: 'node8', color: '#999' },
//     { node: 41, name: 'Diésel', id: 'node8', color: '#b7b7b7' },
//     { node: 42, name: 'Gasolina', id: 'node8', color: '#cccccc' },
//     { node: 43, name: 'GLP', id: 'node8', color: '#c9daf8' },
//     { node: 44, name: 'Gas seco', id: 'node8', color: '#6d9eeb' },
//     { node: 45, name: 'No energéticos', id: 'node8', color: '#ff00ff' },
//     {
//       node: 46,
//       name: 'Pérdidas en transformación',
//       id: 'node8',
//       color: '#999',
//     },
//     {
//       node: 47,
//       name: 'Centrales eléctricas',
//       id: 'node8',
//       color: '#00ff00',
//     },
//     { node: 47, name: 'Electricidad', id: 'node8', color: '#00ff00' },
//   ],
//   links: [
//     {
//       source: 'Producción',
//       target: 'Carbón',
//       value: 192.29,
//       color: '#85200c',
//     },
//     {
//       source: 'Producción',
//       target: 'Petróleo',
//       value: 3821.1,
//       color: '#000000',
//     },
//     {
//       source: 'Producción',
//       target: 'Gas natural',
//       value: 2553,
//       color: '#4a86e8',
//     },
//     {
//       source: 'Producción',
//       target: 'Condensados',
//       value: 140.98,
//       color: '#f00',
//     },
//     {
//       source: 'Producción',
//       target: 'Nucleoenergía',
//       value: 125.62,
//       color: '#9900ff',
//     },
//     {
//       source: 'Producción',
//       target: 'Geoenergía',
//       value: 18.54,
//       color: '#783f04',
//     },
//     {
//       source: 'Producción',
//       target: 'Hidroenergía',
//       value: 96.52,
//       color: '#0ff',
//     },
//     {
//       source: 'Producción',
//       target: 'Energía eólica',
//       value: 70.9,
//       color: '#0000ff',
//     },
//     {
//       source: 'Producción',
//       target: 'Bagazo de caña',
//       value: 99.66,
//       color: '#0ff',
//     },
//     {
//       source: 'Producción',
//       target: 'Biogas',
//       value: 2.53,
//       color: '#6d9eeb',
//     },
//     {
//       source: 'Producción',
//       target: 'Leña',
//       value: 246.62,
//       color: '#b45f06',
//     },
//     {
//       source: 'Producción',
//       target: 'Energía solar',
//       value: 72.75,
//       color: '#ff0',
//     },

//     {
//       source: 'Carbón',
//       target: 'Exportación',
//       value: 0.09,
//       color: '#85200c',
//     },
//     {
//       source: 'Carbón',
//       target: 'Hornos y coquizadoras',
//       value: 27.13,
//       color: '#85200c',
//     },
//     {
//       source: 'Carbón',
//       target: 'Sector industrial',
//       value: 20.95,
//       color: '#85200c',
//     },
//     {
//       source: 'Carbón',
//       target: 'Centrales eléctricas',
//       value: 164.1,
//       color: '#85200c',
//     },
//     { source: 'Carbón', target: 'Otros', value: 1.81, color: '#85200c' },

//     {
//       source: 'Petróleo',
//       target: 'Exportación',
//       value: 2509.2,
//       color: '#000000',
//     },
//     {
//       source: 'Petróleo',
//       target: 'Refinerías y despuntadoras',
//       value: 1303.1,
//       color: '#000000',
//     },
//     {
//       source: 'Petróleo',
//       target: 'Consumo propio',
//       value: 16.82,
//       color: '#000000',
//     },

//     {
//       source: 'Condensados',
//       target: 'Plantas de gas y fraccionadoras',
//       value: 7.26,
//       color: '#F00',
//     },
//     {
//       source: 'Condensados',
//       target: 'Otros',
//       value: 133.72,
//       color: '#F00',
//     },

//     {
//       source: 'Gas natural',
//       target: 'Plantas de gas y fraccionadoras',
//       value: 1072.7,
//       color: '#4a86e8',
//     },
//     {
//       source: 'Gas natural',
//       target: 'Consumo propio',
//       value: 641.15,
//       color: '#4a86e8',
//     },
//     {
//       source: 'Gas natural',
//       target: 'Transferencia interproductos',
//       value: 134.9,
//       color: '#4a86e8',
//     },
//     {
//       source: 'Gas natural',
//       target: 'Otros',
//       value: 704.34,
//       color: '#4a86e8',
//     },

//     {
//       source: 'Nucleoenergía',
//       target: 'Centrales eléctricas',
//       value: 125.62,
//       color: '#9900ff',
//     },

//     {
//       source: 'Geoenergía',
//       target: 'Centrales eléctricas',
//       value: 18.539,
//       color: '#783f04',
//     },

//     {
//       source: 'Energía eólica',
//       target: 'Centrales eléctricas',
//       value: 70.9,
//       color: '#0000ff',
//     },

//     {
//       source: 'Hidroenergía',
//       target: 'Centrales eléctricas',
//       value: 95.52,
//       color: '#0ff',
//     },

//     {
//       source: 'Bagazo de caña',
//       target: 'Otros',
//       value: 1.1,
//       color: '#f6b26b',
//     },
//     {
//       source: 'Bagazo de caña',
//       target: 'Centrales eléctricas',
//       value: 57.82,
//       color: '#f6b26b',
//     },
//     {
//       source: 'Bagazo de caña',
//       target: 'Sector industrial',
//       value: 40.6,
//       color: '#f6b26b',
//     },

//     {
//       source: 'Biogas',
//       target: 'Centrales eléctricas',
//       value: 2.53,
//       color: '#6d9eeb',
//     },

//     {
//       source: 'Energía solar',
//       target: 'Centrales eléctricas',
//       value: 56.48,
//       color: '#ffff00',
//     },
//     {
//       source: 'Energía solar',
//       target: 'Sector industrial',
//       value: 1.3,
//       color: '#ffff00',
//     },
//     {
//       source: 'Energía solar',
//       target: 'Sector comercial y servicios',
//       value: 5.96,
//       color: '#ffff00',
//     },
//     {
//       source: 'Energía solar',
//       target: 'Sector residencial',
//       value: 9.01,
//       color: '#ffff00',
//     },

//     {
//       source: 'Leña',
//       target: 'Sector residencial',
//       value: 246.62,
//       color: '#b45f06',
//     },

//     {
//       source: 'Hornos y coquizadoras',
//       target: 'Coque de carbón',
//       value: 18.47,
//       color: '#cc4125',
//     },
//     {
//       source: 'Hornos y coquizadoras',
//       target: 'Pérdidas en transformación',
//       value: 8.66,
//       color: '#f9a145',
//     },

//     {
//       source: 'Refinerías y despuntadoras',
//       target: 'Coque de petróleo',
//       value: 99.27,
//       color: '#434343',
//     },
//     {
//       source: 'Refinerías y despuntadoras',
//       target: 'Combustóleo',
//       value: 417.32,
//       color: '#666666',
//     },
//     {
//       source: 'Refinerías y despuntadoras',
//       target: 'Diésel',
//       value: 220.49,
//       color: '#b7b7b7',
//     },
//     {
//       source: 'Refinerías y despuntadoras',
//       target: 'Gasolina',
//       value: 357.7,
//       color: '#cccccc',
//     },
//     {
//       source: 'Refinerías y despuntadoras',
//       target: 'GLP',
//       value: 8.43,
//       color: '#c9daf8',
//     },
//     {
//       source: 'Refinerías y despuntadoras',
//       target: 'No energéticos',
//       value: 29.4,
//       color: '#ff00ff',
//     },
//     {
//       source: 'Refinerías y despuntadoras',
//       target: 'Gas seco',
//       value: 76.64,
//       color: '#6d9eeb',
//     },
//     {
//       source: 'Refinerías y despuntadoras',
//       target: 'Pérdidas en transformación',
//       value: 57.06,
//       color: '#FBFBFB',
//     },
//     {
//       source: 'Refinerías y despuntadoras',
//       target: 'Queroseno',
//       value: 36.83,
//       color: '#999',
//     },

//     {
//       source: 'Plantas de gas y fraccionadoras',
//       target: 'Pérdidas en transformación',
//       value: 2.24,
//       color: '#FBFBFB',
//     },
//     {
//       source: 'Plantas de gas y fraccionadoras',
//       target: 'No energéticos',
//       value: 70.8,
//       color: '#ff00ff',
//     },
//     {
//       source: 'Plantas de gas y fraccionadoras',
//       target: 'Gas seco',
//       value: 783.46,
//       color: '#6d9eeb',
//     },
//     {
//       source: 'Plantas de gas y fraccionadoras',
//       target: 'GLP',
//       value: 144.27,
//       color: '#c9daf8',
//     },
//     {
//       source: 'Plantas de gas y fraccionadoras',
//       target: 'Gasolina',
//       value: 79.51,
//       color: '#cccccc',
//     },

//     {
//       source: 'Transferencia interproductos',
//       target: 'Gas seco',
//       value: 134.9,
//       color: '#6d9eeb',
//     },

//     {
//       source: 'Importación',
//       target: 'Carbón',
//       value: 21.79,
//       color: '#85200c',
//     },
//     {
//       source: 'Importación',
//       target: 'Gas seco',
//       value: 1890.4,
//       color: '#6d9eeb',
//     },
//     {
//       source: 'Importación',
//       target: 'Gasolina',
//       value: 649.31,
//       color: '#cccccc',
//     },
//     {
//       source: 'Importación',
//       target: 'GLP',
//       value: 283,
//       color: '#c9daf8',
//     },
//     {
//       source: 'Importación',
//       target: 'Diésel',
//       value: 436.23,
//       color: '#b7b7b7',
//     },
//     {
//       source: 'Importación',
//       target: 'Combustóleo',
//       value: 20.2,
//       color: '#666666',
//     },
//     {
//       source: 'Importación',
//       target: 'Electricidad',
//       value: 35.87,
//       color: '#00ff00',
//     },
//     {
//       source: 'Importación',
//       target: 'Coque de carbón',
//       value: 27.2,
//       color: '#cc4125',
//     },
//     {
//       source: 'Importación',
//       target: 'Coque de petróleo',
//       value: 113.55,
//       color: '#434343',
//     },
//     {
//       source: 'Importación',
//       target: 'Queroseno',
//       value: 45.81,
//       color: '#999',
//     },

//     {
//       source: 'Coque de carbón',
//       target: 'Sector industrial',
//       value: 44.56,
//       color: '#cc4125',
//     },
//     {
//       source: 'Coque de carbón',
//       target: 'Consumo propio',
//       value: 1.11,
//       color: '#cc4125',
//     },

//     {
//       source: 'Coque de petróleo',
//       target: 'Otros',
//       value: 48.27,
//       color: '#434343',
//     },
//     {
//       source: 'Coque de petróleo',
//       target: 'Centrales eléctricas',
//       value: 37.84,
//       color: '#434343',
//     },
//     {
//       source: 'Coque de petróleo',
//       target: 'Exportación',
//       value: 0.07,
//       color: '#434343',
//     },
//     {
//       source: 'Coque de petróleo',
//       target: 'Sector industrial',
//       value: 126.63,
//       color: '#434343',
//     },

//     {
//       source: 'Combustóleo',
//       target: 'Exportación',
//       value: 262.87,
//       color: '#666666',
//     },
//     {
//       source: 'Combustóleo',
//       target: 'Sector industrial',
//       value: 11.72,
//       color: '#666666',
//     },
//     {
//       source: 'Combustóleo',
//       target: 'Consumo propio',
//       value: 37.35,
//       color: '#666666',
//     },
//     {
//       source: 'Combustóleo',
//       target: 'Centrales eléctricas',
//       value: 137.69,
//       color: '#666666',
//     },
//     {
//       source: 'Combustóleo',
//       target: 'Sector transporte',
//       value: 2.09,
//       color: '#666666',
//     },

//     {
//       source: 'Queroseno',
//       target: 'Sector transporte',
//       value: 106.68,
//       color: '#999',
//     },
//     { source: 'Queroseno', target: 'Otros', value: 1.51, color: '#999' },

//     {
//       source: 'Diésel',
//       target: 'Sector transporte',
//       value: 438.34,
//       color: '#b7b7b7',
//     },
//     {
//       source: 'Diésel',
//       target: 'Sector agropecuario',
//       value: 127.34,
//       color: '#b7b7b7',
//     },
//     {
//       source: 'Diésel',
//       target: 'Exportación',
//       value: 36.6,
//       color: '#b7b7b7',
//     },
//     {
//       source: 'Diésel',
//       target: 'Centrales eléctricas',
//       value: 24.32,
//       color: '#b7b7b7',
//     },
//     {
//       source: 'Diésel',
//       target: 'Consumo propio',
//       value: 41.48,
//       color: '#b7b7b7',
//     },
//     {
//       source: 'Diésel',
//       target: 'Sector industrial',
//       value: 62.2,
//       color: '#b7b7b7',
//     },

//     {
//       source: 'Gasolina',
//       target: 'Sector transporte',
//       value: 1404.2,
//       color: '#cccccc',
//     },
//     {
//       source: 'Gasolina',
//       target: 'Sector industrial',
//       value: 1.47,
//       color: '#cccccc',
//     },
//     {
//       source: 'Gasolina',
//       target: 'Exportación',
//       value: 23.49,
//       color: '#cccccc',
//     },

//     {
//       source: 'GLP',
//       target: 'Sector transporte',
//       value: 61.04,
//       color: '#c9daf8',
//     },
//     {
//       source: 'GLP',
//       target: 'Sector comercial y servicios',
//       value: 61.04,
//       color: '#c9daf8',
//     },
//     {
//       source: 'GLP',
//       target: 'Sector industrial',
//       value: 46.34,
//       color: '#c9daf8',
//     },
//     {
//       source: 'GLP',
//       target: 'Sector residencial',
//       value: 240.14,
//       color: '#c9daf8',
//     },
//     {
//       source: 'GLP',
//       target: 'Sector agropecuario',
//       value: 4.9,
//       color: '#c9daf8',
//     },
//     {
//       source: 'GLP',
//       target: 'Exportación',
//       value: 1.21,
//       color: '#c9daf8',
//     },
//     {
//       source: 'GLP',
//       target: 'Otras ramas económicas',
//       value: 6.62,
//       color: '#c9daf8',
//     },
//     { source: 'GLP', target: 'Otros', value: 14.4, color: '#c9daf8' },

//     {
//       source: 'Gas seco',
//       target: 'Sector industrial',
//       value: 438.81,
//       color: '#6d9eeb',
//     },
//     {
//       source: 'Gas seco',
//       target: 'PEMEX Petroquímica',
//       value: 12.05,
//       color: '#6d9eeb',
//     },
//     {
//       source: 'Gas seco',
//       target: 'Sector comercial y servicios',
//       value: 9.5,
//       color: '#6d9eeb',
//     },
//     {
//       source: 'Gas seco',
//       target: 'Sector transporte',
//       value: 1.81,
//       color: '#6d9eeb',
//     },
//     {
//       source: 'Gas seco',
//       target: 'Exportación',
//       value: 2.66,
//       color: '#6d9eeb',
//     },
//     {
//       source: 'Gas seco',
//       target: 'Sector residencial',
//       value: 25.95,
//       color: '#6d9eeb',
//     },
//     {
//       source: 'Gas seco',
//       target: 'Consumo propio',
//       value: 14.4,
//       color: '#6d9eeb',
//     },
//     {
//       source: 'Gas seco',
//       target: 'Centrales eléctricas',
//       value: 1439,
//       color: '#6d9eeb',
//     },

//     {
//       source: 'No energéticos',
//       target: 'Consumo propio',
//       value: 68.06,
//       color: '#ff00ff',
//     },
//     {
//       source: 'No energéticos',
//       target: 'Otras ramas económicas',
//       value: 30.4,
//       color: '#ff00ff',
//     },
//     {
//       source: 'No energéticos',
//       target: 'Otros',
//       value: 1.66,
//       color: '#ff00ff',
//     },

//     {
//       source: 'Centrales eléctricas',
//       target: 'Electricidad',
//       value: 1186.9,
//       color: '#00ff00',
//     },
//     {
//       source: 'Centrales eléctricas',
//       target: 'Pérdidas en transformación',
//       value: 1044.5,
//       color: '#f9a145',
//     },

//     {
//       source: 'Electricidad',
//       target: 'Sector industrial',
//       value: 635.85,
//       color: '#00ff00',
//     },
//     {
//       source: 'Electricidad',
//       target: 'Consumo propio',
//       value: 199.6,
//       color: '#00ff00',
//     },
//     {
//       source: 'Electricidad',
//       target: 'Sector residencial',
//       value: 248.32,
//       color: '#00ff00',
//     },
//     {
//       source: 'Electricidad',
//       target: 'Sector público',
//       value: 14.26,
//       color: '#00ff00',
//     },
//     {
//       source: 'Electricidad',
//       target: 'Sector transporte',
//       value: 3.41,
//       color: '#00ff00',
//     },
//     {
//       source: 'Electricidad',
//       target: 'Sector comercial y servicios',
//       value: 49.48,
//       color: '#00ff00',
//     },
//     {
//       source: 'Electricidad',
//       target: 'Sector agropecuario',
//       value: 50.4,
//       color: '#00ff00',
//     },
//     {
//       source: 'Electricidad',
//       target: 'Exportación',
//       value: 21.44,
//       color: '#00ff00',
//     },

//     {
//       source: 'Otros *',
//       target: 'Diésel',
//       value: 7.56,
//       color: '#b7b7b7',
//     },
//     {
//       source: 'Otros *',
//       target: 'Gasolina',
//       value: 344.06,
//       color: '#cccccc',
//     },
//     {
//       source: 'Otros *',
//       target: 'Gas seco',
//       value: 99.8,
//       color: '#6d9eeb',
//     },
//     {
//       source: 'Otros *',
//       target: 'Combustóleo',
//       value: 14.2,
//       color: '#666666',
//     },
//     {
//       source: 'Otros *',
//       target: 'Queroseno',
//       value: 25.54,
//       color: '#999',
//     },
//   ],
// }

onMounted(() => {
  const itemsGrafica = items
  const width = 800
  const height = 600
  const nodeWidth = 15
  const nodeHeight = 20
  const nodePadding = 10

  const ENABLE_LINKS_GRADIENTS = false

  const svg = d3
    .select(svgRef.value)
    .attr('viewBox', [0, -20, width, height + 20])

  const { nodes, links } = sankey()
    .nodeId(d => d.name)
    .nodeWidth(nodeWidth)
    .nodeSort(false)
    .nodePadding(nodePadding)
    .extent([
      [1, 1],
      [width, height - nodeHeight],
    ])(itemsGrafica)

  const link = svg
    .append('g')
    .attr('fill', 'none')
    .attr('stroke-opacity', 0.7)
    .selectAll('g')
    .data(links)
    .join('g')
    .style('mix-blend-mode', 'multiply')

  if (ENABLE_LINKS_GRADIENTS) {
    const gradient = link
      .append('linearGradient')
      .attr('id', d => d.id)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', d => d.source.x1)
      .attr('x2', d => d.target.x0)

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', d => d.source.color)

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', d => d.target.color)
  }

  let tooltip = d3
    .select('#sankey-biomasa')
    .append('div')
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .style('border', '1px solid #333')
    .style('font-family', 'Arial')
    .style('font-size', '10pt')
    .style('font-weight', 'bold')
    .style('max-width', '200px')
    .style('padding', '5px')
    .style('background-color', '#FFF')
    .text('Tooltip')

  link
    .append('path')
    .attr('d', sankeyLinkHorizontal())
    .attr('stroke', d => d.color)
    .attr('stroke-width', d => Math.max(1, d.width))
    .attr('opacity', '0.5')
    .on('mouseover', function (d, i) {
      d3.select(this).transition().duration('50').attr('opacity', '1')
      tooltip.style('background-color', i.color)
      tooltip.style('color', i.color === '#000000' ? '#FFF' : '#000')
      tooltip.text(
        '' +
          i.source.name +
          ' → ' +
          i.target.name +
          ' : ' +
          i.value +
          ' MtMS/año'
      )
      tooltip.style('visibility', 'visible')
    })
    .on('mouseout', function () {
      d3.select(this).transition().duration('50').attr('opacity', '0.5')
      tooltip.style('visibility', 'hidden')
    })
    .on('mousemove', function (d) {
      return tooltip
        .style('top', d.pageY + 10 + 'px')
        .style('left', d.pageX + 10 + 'px')
    })

  svg
    .append('g')
    .attr('font-size', 9)
    .attr('font-weight', 'bold')
    .selectAll('text')
    .data(nodes)
    .join('text')
    .attr('x', d => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
    .attr('y', d => (d.y1 + d.y0) / 2)
    .attr('dy', '0.35em')
    .attr('text-anchor', d => (d.x0 < width / 2 ? 'start' : 'end'))
    .text(d => d.name)
    .attr('class', 'node-text-rect')
    .attr('id', function (d, i) {
      d.id = i
      return 'rect-text-' + i
    })
    .append('tspan')
    .attr('font-size', 9)
    .attr('fill-opacity', 0.7)
    .text(d => ` (${d.value.toLocaleString()})`)

  svg
    .append('g')
    .attr('stroke', '#333')
    .attr('stroke-width', '0.75')
    .selectAll('rect')
    .data(nodes)
    .join('rect')
    .attr('x', d => d.x0 + 1)
    .attr('y', d => d.y0)
    .attr('height', d => d.y1 - d.y0)
    .attr('width', d => d.x1 - d.x0 - 2)
    .attr('fill', d => d.color)
    .attr('class', 'node-rect')
    .attr('id', function (d, i) {
      d.id = i
      return 'rect-' + i
    })
    .on('mouseover', function (d, i) {
      let nodeHiglight = []

      link
        .transition()
        .duration(300)
        .style('stroke-opacity', function (l) {
          if (l.source.index === i.index || l.target.index === i.index) {
            nodeHiglight.push(l.target.id)
            nodeHiglight.push(l.source.id)
          }

          return l.source.index === i.index || l.target.index === i.index
            ? 1
            : 0.2
        })

      tooltip.style('background-color', i.color)
      tooltip.style('color', i.color === '#000000' ? '#FFF' : '#000')
      tooltip.text('' + i.name + ' : ' + i.value.toLocaleString() + ' MtMS/año')
      tooltip.style('visibility', 'visible')

      d3.selectAll('.node-rect').style('opacity', 0.2)
      d3.selectAll('.node-text-rect').style('opacity', 0.2)
      for (let i = 0; i < nodeHiglight.length; i++) {
        d3.select('#rect-' + nodeHiglight[i]).style('opacity', 1)
        d3.select('#rect-text-' + nodeHiglight[i]).style('opacity', 1)
      }
    })
    .on('mouseleave', function () {
      link.transition().duration(300).style('stroke-opacity', 0.5)

      d3.selectAll('.node-text-rect').style('opacity', 1)
      d3.selectAll('.node-rect').style('opacity', 1)
      tooltip.style('visibility', 'hidden')
    })
    .on('mousemove', function (d) {
      return tooltip
        .style('top', d.pageY + 10 + 'px')
        .style('left', d.pageX + 10 + 'px')
    })
})
</script>
<template>
  <div class="sankey-component">
    <h2>Sankey</h2>
    <div
      class="container"
      id="sankey-biomasa"
    >
      <!-- <svg ref="svg"></svg> -->
      <svg ref="svgRef"></svg>
    </div>
  </div>
</template>
<!-- <script>
import * as d3 from 'd3'
import { sankey } from 'd3-sankey'
import { sankeyLinkHorizontal } from 'd3-sankey'

export default {
  data() {
    return {
      items: {
        nodes: [
          {
            node: 9,
            name: 'Pino',
            id: 'node9',
            color: '#846026',
            description:
              'Este valor se estimó en función del crecimiento anual de biomasa y de la capa de Uso de Suelo y Vegetación, Serie VI de INEGI, 2016. Contempla la productividad anual de los bosques de coníferas, de los cuales se obtiene leña para el uso residencial y otra parte es destinada a la producción forestal nacional y exportaciones autorizadas por SEMARNAT.',
            ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); Uso de Suelo y Vegetación Serie VI de INEGI (2016).',
          },
          {
            node: 10,
            name: 'Encino',
            id: 'node10',
            color: '#f69633',
            description:
              'Este valor se estimó en función del crecimiento anual de biomasa y de la capa de Uso de Suelo y Vegetación, Serie VI de INEGI, 2016. Contempla la productividad anual de los bosques de encino, de los cuales se obtiene carbón vegetal y leña. Asimismo, los encinos son utilizados para distintos productos, reportados en la producción forestal nacional SEMARNAT, 2018.',
            ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); Uso de Suelo y Vegetación Serie VI de INEGI (2016).',
          },
          {
            node: 11,
            name: 'Tropicales 1',
            id: 'node11',
            color: '#a7bd14',
            description:
              'Este valor se estimó en función del crecimiento anual de biomasa y de la capa de Uso de Suelo y Vegetación, Serie VI de INEGI, 2016. Contempla la productividad anual de las especies leñosas en las selvas. De estas especies, se obtienen distintos productos con fines energéticos, como la leña y el carbón vegetal, también, las maderas tropicales son utilizadas para elaboración y exportación de distintos productos reportados en la producción forestal nacional, SEMARNAT, 2018.',
            ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); Uso de Suelo y Vegetación Serie VI de INEGI (2016).',
          },
          {
            node: 12,
            name: 'Matorrales',
            id: 'node12',
            color: '#f95e2c',
            description:
              'Este valor se estimó en función del crecimiento anual de biomasa y de la capa de Uso de Suelo y Vegetación, Serie VI de INEGI, 2016. Contempla la productividad anual de los matorrales. Es importante mencionar que en la literatura no se contempla el uso de esta vegetación con fines energéticos, pero en consultas de expertos nos dicen que este tipo de vegetación se usa como leña y para la producción de carbón vegetal.',
            ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); Uso de Suelo y Vegetación Serie VI de INEGI (2016); Consulta de expertos.',
          },
          {
            node: 7,
            name: 'Aserraderos',
            id: 'node7',
            color: '#999',
            description:
              'El valor para los aserraderos considera la biomasa que proviene principalmente de la productividad de bosques, selvas y árboles frutales, así como la importación de carbón, leña y madera en rollo (SEMARNAT, 2018). La biomasa transformada se transporta al sector industrial como: aserrín y otros, astillas y pellets. Los productos maderables y no maderables son destinados a usos no energéticos.',
            ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
          },
          {
            node: 19,
            name: 'Leña',
            id: 'node20',
            color: '#999',
            description:
              'Se refiere a la madera cortada con instrumentos afilados, en trozos más largos y gruesos que las astillas de madera. Este producto proviene principalmente del manejo de bosques de encino, ecosistemas tropicales y bosques de coníferas. Sus principales usos se encuentran en el sector residencial (cocción y calefacción), comercio e industria (venta de alimentos preparados, calefacción y otros).',
            ref: 'Serrano-Medrano et. al., (2014); Masera et. al., (2012) y BCS/Línea 4',
          },
          {
            node: 5,
            name: 'Importación de carbón y leña',
            id: 'node5',
            color: '#646e12',
            description:
              'Los valores de importación fueron tomados del Anuario Estadístico de la Producción Forestal, elaborado por SEMARNAT en 2018, en donde se reporta la cantidad de carbón y leña que entra al país.',
            ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
          },
          {
            node: 6,
            name: 'Importación de madera en rollo',
            id: 'node6',
            color: '#acb83f',
            description:
              'Los valores de importación fueron tomados del Anuario Estadístico de la Producción Forestal, elaborado por SEMARNAT en 2018, en donde se reporta la cantidad de madera en rollo que entra al país. Estos valores se tomaron en cuenta, ya que al pasar por el aserradero generan residuos que se pueden llegar a convertir en biocombustibles sólidos.',
            ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
          },
          {
            node: 13,
            name: 'Caña',
            id: 'node13',
            color: '#198d26',
            description:
              'Se considera el cultivo de caña por separado del resto de cultivos anuales por contar con registros oficiales de producción y cuantificación de bagazo generado. La cantidad de rastrojo generado fue estimada por modelos de productividad y comparada con los registros oficiales.',
            ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); SIAP (2022)',
          },
          {
            node: 14,
            name: 'Maíz y otros',
            id: 'node14',
            color: '#198d26',
            description:
              'Este valor considera los residuos generados por los cultivos de maíz, trigo y sorgo, que representan el 55% de la producción de cultivos anuales a nivel nacional. La estimación de residuos se generó con mapas de productividad media anual por municipio.',
            ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); SIAP (2022)',
          },
          {
            node: 17,
            name: 'Árboles frutales',
            id: 'node17',
            color: '#d0df15',
            description:
              'Se considera el potencial máximo de 64 PJ/año proveniente de podas anuales de árboles de aguacate, mango, cítricos, nuez, manzana, durazno, uva y guayaba. Se contempla una producción media de 4 toneladas de materia seca de podas por hectárea, y una disponibilidad de biomasa para energía del 60%.',
            ref: 'Tauro et. al., (2018)',
          },
          {
            node: 16,
            name: 'Agave',
            id: 'node16',
            color: '#acc203',
            description:
              'Este valor considera los valores reportados de generación de residuos para los cultivos de bagazo de maguey.',
            ref: 'Valdez-Vazquez, (2010)',
          },
          {
            node: 20,
            name: 'Pino y otras coníferas',
            id: 'node19',
            color: '#999',
            description:
              'Este valor contempla la producción forestal de pino y otras coníferas que son enviadas a las industrias de transformación primaria para la elaboración de diferentes productos forestales y sus derivados. A la producción registrada por SEMARNAT se suma un porcentaje de madera proveniente de los aprovechamientos forestales no reportados.',
            ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
          },
          {
            node: 22,
            name: 'Encino y otras latifoliadas',
            id: 'node22',
            color: '#999',
            description:
              'Este valor contempla la producción forestal de encino y otras latifoliadas que son enviadas a las industrias de transformación primaria para la elaboración de diferentes productos forestales y sus derivados. A la producción registrada por SEMARNAT se suma un porcentaje de madera proveniente de los aprovechamientos forestales no reportados.',
            ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
          },
          {
            node: 23,
            name: 'Hornos de carbón',
            id: 'node23',
            color: '#999',
            description:
              'El porcentaje de participación de la materia prima que llega a los hornos de carbón proviene de mayor a menor medida: encino, tropicales y matorrales. El carbón vegetal que sale de los hornos tiene un uso energético principalmente en el sector residencial, comercial y exportaciones.',
            ref: 'Arias, (2020); consulta de expertos',
          },
          {
            node: 24,
            name: 'Tropicales',
            id: 'node24',
            color: '#999',
            description:
              'Este valor contempla la producción forestal de especies tropicales que son enviadas a las industrias de transformación primaria para la elaboración de diferentes productos forestales y sus derivados. A la producción registrada por SEMARNAT se suma un porcentaje de madera proveniente de los aprovechamientos forestales no reportados.',
            ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
          },
          {
            node: 25,
            name: 'Bagazo',
            id: 'node25',
            color: '#999',
            description:
              'El bagazo incluye los cultivos de agave y caña principalmente. Su principal uso es energético como combustible en las industrias donde se generan los residuos (ingenios azucareros y tequileras).',
            ref: 'BCS/Línea 4; PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018)',
          },
          {
            node: 26,
            name: 'RAC',
            id: 'node26',
            color: '#999',
            description:
              'Los rastrojos o residuos agrícolas de cosecha (RAC) son subproductos derivados de las actividades agrícolas, y se les considera como la porción del cultivo cosechado (hojas, tallos, espigas y brácteas de la mazorca) que queda después de extraer el grano. La producción nacional es de 45 MtMS, provenientes de diez cultivos; entre ellos, los principales son: el maíz, el sorgo, el trigo y la cebada.\n\nEl consumo nacional de rastrojos se estimó en 43.3 millones de toneladas, principalmente para usos no energéticos como insumo alimenticio en el sector pecuario (bovinos, ovinos y caprinos, principalmente). Si bien los rastrojos son empleados principalmente como forraje para el ganado, estos tienen otros usos: se emplean como mejoradores de suelo al dejarlos como cobertura, como materiales de construcción. Por otra parte, está su uso en los fogones tradicionales y a nivel industrial como biocombustibles.',
            ref: 'Reyes-Muro et. al., (2013)',
          },
          {
            node: 28,
            name: 'Olote',
            id: 'node27',
            color: '#999',
            description:
              'Es un residuo o subproducto agrícola que se genera en grandes cantidades en el proceso de separación del grano de la mazorca. Entre los usos del olote que han sido reportados en la literatura se encuentran la aplicación como forraje para rumiantes y soporte para disminuir la erosión en la tierra.',
            ref: 'Tauro et. al., (2018); Córdoba et. al., (2013).',
          },
          {
            node: 29,
            name: 'Carbón vegetal',
            id: 'node29',
            color: '#999',
            description:
              'Biocombustible sólido derivado de la carbonización, la pirólisis o la torrefacción de combustibles forestales. Este producto proviene principalmente del manejo de bosques de encino y zonas tropicales. El carbón vegetal es usado en el sector residencial y comercial, principalmente para la cocción de alimentos.',
            ref: 'Serrano-Medrano et. al., (2014); BCS/Línea 4',
          },
          {
            node: 30,
            name: 'Aserrín',
            id: 'node30',
            color: '#999',
            description:
              'Se refiere a las partículas finas de 1 a 5 mm que se derivan del aserrado de madera, se usa principalmente en pequeñas industrias, como combustible o mezcla para la fabricación de ladrillos, asimismo, tiene una gran cantidad de usos no energéticos, como la fabricación de aglomerados, usos veterinarios, y en diversos comercios es usado para limpieza (carnicerías, productores de aceite, etc).',
            ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
          },
          {
            node: 31,
            name: 'Astillas',
            id: 'node31',
            color: '#999',
            description:
              'Las astillas son trozos de madera de pequeñas dimensiones que quedan después de la generación de productos forestales en la industria del procesamiento de la madera. Asimismo, los pellets son biocombustibles sólidos densificados obtenidos de biomasa pulverizada que se genera en los aserraderos. Pueden tener diferentes usos, entre los cuales destaca, el energético en la industria y usos no energéticos como camas para los animales de las veterinarias.',
            ref: 'BCS/Línea 4; Arias, (2020)',
          },
          {
            node: 32,
            name: 'Otros productos maderables y no maderables',
            id: 'node31',
            color: '#999',
            description:
              'Los otros tipos de productos maderables contemplan materiales leñosos como: escuadría, durmientes, chapa y triplay. Por otro lado, los principales productos no maderables son: resinas, gomas, rizomas, tierra de monte, fibras y ceras. El destino de ambos productos son principalmente para usos no energéticos y exportación.',
            ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
          },
          {
            node: 35,
            name: 'Residencial',
            id: 'node35',
            color: '#999',
            description:
              'Este sector considera el uso de dos biocombustibles sólidos (BCS)*: leña y carbón vegetal. El valor de ambos se consideró a partir de la investigación realizada por (Serrano-Medrano et. al., 2014), en la que se estimó el consumo anual de éstos. Se realizó un análisis detallado del consumo específico* por vivienda y usuarios, así como la saturación de consumidores* de leña y carbón vegetal por tamaño de localidad. Asimismo, la demanda de Pellets es muy baja en el sector residencial para calefacción de ambiente en el Norte de México (<10 toneladas/año) (Arias, 2020).',
            ref: 'Serrano-Medrano et. al., (2014); Arias, (2020)',
          },
          {
            node: 33,
            name: 'Comercio',
            id: 'node33',
            color: '#999',
            description:
              'Descripción: Los valores se obtuvieron a partir del estudio de investigación desarrollado en campo por la Línea 4 del Clúster de BCS. La leña es el principal BCS utilizado en la cocción de alimentos (venta de alimentos preparados, tortillerías, hospedaje) y calefacción de ambiente (oficinas de gobierno y hospedaje), seguida del carbón vegetal (venta de alimentos preparados) (CBCS L-4). Asimismo, se consideraron los valores de carbón vegetal en comercios formales e informales, reportados por (Serrano-Medrano et. al., 2014).',
            ref: 'CBCS L-4; Serrano-Medrano et. al., (2014)',
          },
          {
            node: 34,
            name: 'Industrial',
            id: 'node34',
            color: '#999',
            description:
              'Este sector considera el uso de diferentes tipos de BCS. La leña es el principal BCS utilizado en la pequeña y mediana industria: lácteos, ladrilleras y mezcaleras (CBCS L-4; Masera et. al., 2012). En la gran industria se utilizan principalmente los siguientes BCS: ingenios azucareros (bagazo de caña, astillas), tequileras (bagazo de agave, astillas), cerveceras (astillas) (CBCS L-4; Arias, 2020).',
            ref: 'CBCS L-4; Masera et. al., (2012); Arias, (2020)',
          },
          {
            node: 34,
            name: 'Pellets',
            id: 'node35',
            color: '#999',
            description:
              'Este sector considera el uso de diferentes tipos de BCS. La leña es el principal BCS utilizado en la pequeña y mediana industria: lácteos, ladrilleras y mezcaleras (CBCS L-4; Masera et. al., 2012). En la gran industria se utilizan principalmente los siguientes BCS: ingenios azucareros (bagazo de caña, astillas), tequileras (bagazo de agave, astillas), cerveceras (astillas) (CBCS L-4; Arias, 2020).',
            ref: 'CBCS L-4; Masera et. al., (2012); Arias, (2020)',
          },
          {
            node: 36,
            name: 'Usos no energéticos',
            id: 'node36',
            color: '#999',
            description:
              'Este valor considera los RAC que se utilizan para forraje, incorporación en terrenos agrícolas, camas para el ganado y sustrato en la producción de hongos comestibles. El aserrín se utiliza para la fabricación de aglomerados, usos veterinarios, y en diversos comercios es usado para limpieza (carnicerías, productores de aceite, etc). Los usos no energéticos principales de las astillas y pellets son en camas para los animales de las veterinarias.',
            ref: 'Reyes-Muro et. al., (2013); BCS/Línea 4; Arias, (2020); Consulta de expertos; Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
          },
          {
            node: 8,
            name: 'Exportaciones',
            id: 'node8',
            color: '#999',
            description:
              'Se consideran los valores reportados por el Anuario Estadístico Forestal, SEMARNAT, 2018. Los principales productos exportados son ventanas, puertas, tableros, cajas; asimismo se exporta leña y carbón vegetal.',
            ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
          },
        ],
        links: [
          {
            source: 'Pino',
            target: 'Leña',
            value: 51.7,
            color: '#846026',
          },
          {
            source: 'Pino',
            target: 'Pino y otras coníferas',
            value: 124.9,
            color: '#846026',
          },
          {
            source: 'Encino',
            target: 'Encino y otras latifoliadas',
            value: 129,
            color: '#f69633',
          },
          {
            source: 'Encino',
            target: 'Hornos de carbón',
            value: 47.1,
            color: '#f69633',
          },
          {
            source: 'Encino',
            target: 'Leña',
            value: 103.4,
            color: '#f69633',
          },
          {
            source: 'Tropicales 1',
            target: 'Hornos de carbón',
            value: 4.2,
            color: '#a7bd14',
          },
          {
            source: 'Tropicales 1',
            target: 'Leña',
            value: 77.6,
            color: '#a7bd14',
          },
          {
            source: 'Tropicales 1',
            target: 'Tropicales',
            value: 35.7,
            color: '#a7bd14',
          },
          {
            source: 'Matorrales',
            target: 'Hornos de carbón',
            value: 1.4,
            color: '#f95e2c',
          },
          {
            source: 'Matorrales',
            target: 'Leña',
            value: 25.9,
            color: '#f95e2c',
          },
          {
            source: 'Importación de carbón y leña',
            target: 'Carbón vegetal',
            value: 0.19,
            color: '#646e12',
          },
          {
            source: 'Importación de carbón y leña',
            target: 'Leña',
            value: 0.11,
            color: '#646e12',
          },
          {
            source: 'Importación de madera en rollo',
            target: 'Aserraderos',
            value: 0.32,
            color: '#acb83f',
          },
          {
            source: 'Pino y otras coníferas',
            target: 'Aserraderos',
            value: 83,
            color: '#b6906e',
          },
          {
            source: 'Pino y otras coníferas',
            target: 'Astillas',
            value: 6,
            color: '#b6906e',
          },
          {
            source: 'Pino y otras coníferas',
            target: 'Leña',
            value: 35.9,
            color: '#b6906e',
          },
          {
            source: 'Encino y otras latifoliadas',
            target: 'Aserraderos',
            value: 47.9,
            color: '#b6906e',
          },
          {
            source: 'Encino y otras latifoliadas',
            target: 'Hornos de carbón',
            value: 45.3,
            color: '#b6906e',
          },
          {
            source: 'Encino y otras latifoliadas',
            target: 'Leña',
            value: 34,
            color: '#b6906e',
          },
          {
            source: 'Tropicales',
            target: 'Aserraderos',
            value: 12.9,
            color: '#656c43',
          },
          {
            source: 'Tropicales',
            target: 'Hornos de carbón',
            value: 11.1,
            color: '#656c43',
          },
          {
            source: 'Tropicales',
            target: 'Leña',
            value: 6.7,
            color: '#656c43',
          },
          {
            source: 'Caña',
            target: 'Bagazo',
            value: 52.65,
            color: '#198d26',
          },
          {
            source: 'Maíz y otros',
            target: 'Olote',
            value: 39.6,
            color: '#198e21',
          },
          {
            source: 'Árboles frutales',
            target: 'Aserraderos',
            value: 6.8,
            color: '#d0df15',
          },
          {
            source: 'Árboles frutales',
            target: 'Leña',
            value: 20.3,
            color: '#e9ef7f',
          },
          {
            source: 'Agave',
            target: 'Bagazo',
            value: 22.5,
            color: '#acc203',
          },
          {
            source: 'Hornos de carbón',
            target: 'Carbón vegetal',
            value: 109.1,
            color: '#a04e04',
          },
          {
            source: 'Aserraderos',
            target: 'Aserrín',
            value: 1.2,
            color: '#fb5b29',
          },
          {
            source: 'Aserraderos',
            target: 'Astillas',
            value: 7.7,
            color: '#fc6e46',
          },
          {
            source: 'Aserraderos',
            target: 'Leña',
            value: 31.4,
            color: '#fc6e46',
          },
          {
            source: 'Aserraderos',
            target: 'Otros productos maderables y no maderables',
            value: 110,
            color: '#522007',
          },
          {
            source: 'Leña',
            target: 'Comercio',
            value: 13,
            color: '#d39e93',
          },
          {
            source: 'Leña',
            target: 'Exportaciones',
            value: 2.8,
            color: '#845f29',
          },
          {
            source: 'Leña',
            target: 'Industrial',
            value: 27.4,
            color: '#ef3f11',
          },
          {
            source: 'Leña',
            target: 'Residencial',
            value: 343.8,
            color: '#845f29',
          },
          {
            source: 'Carbón vegetal',
            target: 'Comercio',
            value: 6.3,
            color: '#d39e93',
          },
          {
            source: 'Carbón vegetal',
            target: 'Exportaciones',
            value: 15.7,
            color: '#9b5205',
          },
          {
            source: 'Carbón vegetal',
            target: 'Industrial',
            value: 0.3,
            color: '#f33e03',
          },
          {
            source: 'Carbón vegetal',
            target: 'Residencial',
            value: 87,
            color: '#9b5205',
          },
          {
            source: 'Astillas',
            target: 'Industrial',
            value: 13.7,
            color: '#fb3a04',
          },
          {
            source: 'Aserrín',
            target: 'Pellets',
            value: 9,
            color: '#b05e06',
          },
          {
            source: 'Aserrín',
            target: 'Industrial',
            value: 1.2,
            color: '#b05e06',
          },
          {
            source: 'Pellets',
            target: 'Comercio',
            value: 14,
            color: '#b05e06',
          },
          {
            source: 'Pellets',
            target: 'Residencial',
            value: 13,
            color: '#b05e06',
          },
          {
            source: 'Bagazo',
            target: 'Pellets',
            value: 18,
            color: '#1d8b26',
          },
          {
            source: 'Bagazo',
            target: 'Industrial',
            value: 75.2,
            color: '#1d8b26',
          },
          {
            source: 'Olote',
            target: 'Residencial',
            value: 39.6,
            color: '#198d23',
          },
        ],
      },
      items2: {
        nodes: [
          { node: 9, name: 'Pino', id: 'node9', color: '#846026' },
          { node: 10, name: 'Encino', id: 'node10', color: '#f69633' },
          { node: 11, name: 'Tropicales 1', id: 'node11', color: '#a7bd14' },
          { node: 12, name: 'Matorrales', id: 'node12', color: '#f95e2c' },
          { node: 7, name: 'Aserradero', id: 'node7', color: '#999' },
          { node: 19, name: 'Leña', id: 'node20', color: '#999' },
          {
            node: 5,
            name: 'Importación\nde carbón\ny leña',
            id: 'node5',
            color: '#646e12',
          },
          {
            node: 6,
            name: 'Importación\nde madera\nen rollo',
            id: 'node6',
            color: '#acb83f',
          },
          { node: 13, name: 'Caña', id: 'node13', color: '#198d26' },
          { node: 14, name: 'Maíz y\notros', id: 'node14', color: '#198d26' },
          {
            node: 17,
            name: 'Árboles\nfrutales',
            id: 'node17',
            color: '#d0df15',
          },
          { node: 16, name: 'Agave', id: 'node16', color: '#acc203' },
          {
            node: 20,
            name: 'Pino y otras\nconíferas',
            id: 'node19',
            color: '#999',
          },
          {
            node: 22,
            name: 'Encino\ny otras\nlatifoliadas',
            id: 'node22',
            color: '#999',
          },
          { node: 23, name: 'Hornos de\ncarbón', id: 'node23', color: '#999' },
          { node: 24, name: 'Tropicales', id: 'node24', color: '#999' },
          { node: 25, name: 'Bagazo', id: 'node25', color: '#999' },
          { node: 26, name: 'RAC', id: 'node26', color: '#999' },
          { node: 28, name: 'Olote', id: 'node27', color: '#999' },
          { node: 29, name: 'Carbón vegetal', id: 'node29', color: '#999' },
          { node: 30, name: 'Aserrín y otros', id: 'node30', color: '#999' },
          {
            node: 31,
            name: 'Astillas y\npellets',
            id: 'node31',
            color: '#999',
          },
          {
            node: 32,
            name: 'Otros productos maderables y no maderables',
            id: 'node31',
            color: '#999',
          },
          { node: 35, name: 'Residencial', id: 'node35', color: '#999' },
          { node: 33, name: 'Comercio', id: 'node33', color: '#999' },
          { node: 34, name: 'Industrial', id: 'node34', color: '#999' },
          {
            node: 36,
            name: 'Usos no\nenergéticos',
            id: 'node36',
            color: '#999',
          },
          { node: 8, name: 'Exportaciones', id: 'node8', color: '#999' },
        ],
        links: [
          { source: 'Pino', target: 'Leña', value: 3.12, color: '#846026' },
          {
            source: 'Pino',
            target: 'Pino y otras\nconíferas',
            value: 17.25,
            color: '#846026',
          },
          {
            source: 'Encino',
            target: 'Encino\ny otras\nlatifoliadas',
            value: 9.63,
            color: '#f69633',
          },
          {
            source: 'Encino',
            target: 'Hornos de\ncarbón',
            value: 3.13,
            color: '#f69633',
          },
          { source: 'Encino', target: 'Leña', value: 6.24, color: '#f69633' },
          {
            source: 'Tropicales 1',
            target: 'Hornos de\ncarbón',
            value: 0.59,
            color: '#a7bd14',
          },
          {
            source: 'Tropicales 1',
            target: 'Leña',
            value: 4.68,
            color: '#adc015',
          },
          {
            source: 'Tropicales 1',
            target: 'Tropicales',
            value: 3.14,
            color: '#adc015',
          },
          {
            source: 'Matorrales',
            target: 'Hornos de\ncarbón',
            value: 0.2,
            color: '#f95e2c',
          },
          {
            source: 'Matorrales',
            target: 'Leña',
            value: 0.78,
            color: '#f95e2c',
          },
          {
            source: 'Importación\nde carbón\ny leña',
            target: 'Leña',
            value: 0.01,
            color: '#646e12',
          },
          {
            source: 'Importación\nde carbón\ny leña',
            target: 'Carbón vegetal',
            value: 0.01,
            color: '#646e12',
          },
          {
            source: 'Importación\nde madera\nen rollo',
            target: 'Aserradero',
            value: 0.0175655,
            color: '#acb83f',
          },
          {
            source: 'Pino y otras\nconíferas',
            target: 'Aserradero',
            value: 13.18,
            color: '#b6906e',
          },
          {
            source: 'Pino y otras\nconíferas',
            target: 'Astillas y\npellets',
            value: 1.32,
            color: '#b6906e',
          },
          {
            source: 'Pino y otras\nconíferas',
            target: 'Exportaciones',
            value: 0.02,
            color: '#b6906e',
          },
          {
            source: 'Pino y otras\nconíferas',
            target: 'Leña',
            value: 2.73,
            color: '#b6906e',
          },
          {
            source: 'Encino\ny otras\nlatifoliadas',
            target: 'Aserradero',
            value: 6.93,
            color: '#b6906e',
          },
          {
            source: 'Encino\ny otras\nlatifoliadas',
            target: 'Hornos de\ncarbón',
            value: 1.4,
            color: '#b6906e',
          },
          {
            source: 'Encino\ny otras\nlatifoliadas',
            target: 'Leña',
            value: 1.3,
            color: '#b6906e',
          },
          {
            source: 'Tropicales',
            target: 'Aserradero',
            value: 2.23,
            color: '#656c43',
          },
          {
            source: 'Tropicales',
            target: 'Hornos de\ncarbón',
            value: 0.5,
            color: '#656c43',
          },
          {
            source: 'Tropicales',
            target: 'Leña',
            value: 0.39,
            color: '#656c43',
          },
          {
            source: 'Tropicales',
            target: 'Exportaciones',
            value: 0.02,
            color: '#656c43',
          },
          { source: 'Caña', target: 'RAC', value: 8.4, color: '#198d26' },
          { source: 'Caña', target: 'Bagazo', value: 7.6, color: '#168f25' },
          {
            source: 'Maíz y\notros',
            target: 'Olote',
            value: 7,
            color: '#198e21',
          },
          {
            source: 'Árboles\nfrutales',
            target: 'Aserradero',
            value: 1,
            color: '#d0df15',
          },
          {
            source: 'Árboles\nfrutales',
            target: 'Leña',
            value: 0.78,
            color: '#e9ef7f',
          },
          { source: 'Agave', target: 'Bagazo', value: 1.5, color: '#acc203' },
          {
            source: 'Hornos de\ncarbón',
            target: 'Carbón vegetal',
            value: 7.64,
            color: '#a04e04',
          },
          {
            source: 'Aserradero',
            target: 'Aserrín y otros',
            value: 2.1,
            color: '#fb5b29',
          },
          {
            source: 'Aserradero',
            target: 'Astillas y\npellets',
            value: 2.46,
            color: '#fc6e46',
          },
          {
            source: 'Aserradero',
            target: 'Leña',
            value: 1.46,
            color: '#fc6e46',
          },
          {
            source: 'Aserradero',
            target: 'Otros productos maderables y no maderables',
            value: 15.52,
            color: '#522007',
          },
          {
            source: 'Aserradero',
            target: 'Hornos de\ncarbón',
            value: 1.82,
            color: '#748116',
          },
          { source: 'Leña', target: 'Comercio', value: 0.72, color: '#d39e93' },
          {
            source: 'Leña',
            target: 'Industrial',
            value: 1.52,
            color: '#ef3f11',
          },
          {
            source: 'Leña',
            target: 'Residencial',
            value: 19.1,
            color: '#845f29',
          },
          {
            source: 'Leña',
            target: 'Exportaciones',
            value: 0.15,
            color: '#845f29',
          },
          {
            source: 'Carbón vegetal',
            target: 'Comercio',
            value: 0.22,
            color: '#d39e93',
          },
          {
            source: 'Carbón vegetal',
            target: 'Industrial',
            value: 3,
            color: '#f33e03',
          },
          {
            source: 'Carbón vegetal',
            target: 'Residencial',
            value: 2.9,
            color: '#9b5205',
          },
          {
            source: 'Carbón vegetal',
            target: 'Exportaciones',
            value: 0.52,
            color: '#9b5205',
          },
          {
            source: 'Aserrín y otros',
            target: 'Industrial',
            value: 1.05,
            color: '#b05e06',
          },
          {
            source: 'Aserrín y otros',
            target: 'Usos no\nenergéticos',
            value: 1.05,
            color: '#ea4110',
          },
          {
            source: 'Astillas y\npellets',
            target: 'Industrial',
            value: 1.39,
            color: '#fb3a04',
          },
          {
            source: 'Astillas y\npellets',
            target: 'Usos no\nenergéticos',
            value: 2.39,
            color: '#ee4009',
          },
          {
            source: 'Otros productos maderables y no maderables',
            target: 'Usos no\nenergéticos',
            value: 14.45,
            color: '#a7bc17',
          },
          {
            source: 'Otros productos maderables y no maderables',
            target: 'Exportaciones',
            value: 1.07,
            color: '#a7bc17',
          },
          {
            source: 'Bagazo',
            target: 'Industrial',
            value: 9.1,
            color: '#1d8b26',
          },
          {
            source: 'Olote',
            target: 'Usos no\nenergéticos',
            value: 3.5,
            color: '#198d23',
          },
          {
            source: 'Olote',
            target: 'Residencial',
            value: 3.5,
            color: '#198d23',
          },
          {
            source: 'RAC',
            target: 'Usos no\nenergéticos',
            value: 8.4,
            color: '#198d23',
          },
        ],
      },
      items3: {
        nodes: [
          { node: 1, name: 'Producción', id: 'node9', color: '#999' },
          { node: 2, name: 'Importación', id: 'node10', color: '#999' },
          { node: 3, name: 'Exportación', id: 'node11', color: '#999' },
          { node: 7, name: 'Petróleo', id: 'node5', color: '#000000' },
          { node: 6, name: 'Carbón', id: 'node20', color: '#85200c' },
          { node: 8, name: 'Condensados', id: 'node6', color: '#f00' },
          { node: 9, name: 'Gas natural', id: 'node13', color: '#4a86e8' },
          { node: 10, name: 'Nucleoenergía', id: 'node14', color: '#9900ff' },
          { node: 11, name: 'Geoenergía', id: 'node17', color: '#783f04' },
          { node: 12, name: 'Energía eólica', id: 'node16', color: '#0000ff' },
          { node: 13, name: 'Hidroenergía', id: 'node19', color: '#0ff' },
          { node: 14, name: 'Bagazo de caña', id: 'node22', color: '#0ff' },
          { node: 15, name: 'Biogas', id: 'node23', color: '#6d9eeb' },
          { node: 16, name: 'Energía solar', id: 'node24', color: '#ff0' },
          { node: 17, name: 'Leña', id: 'node25', color: '#b45f06' },
          { node: 18, name: 'Otros', id: 'node26', color: '#999' },
          { node: 20, name: 'Consumo propio', id: 'node29', color: '#999' },
          { node: 22, name: 'Otros *', id: 'node31', color: '#999' },
          { node: 25, name: 'Sector industrial', id: 'node33', color: '#999' },
          { node: 26, name: 'Sector transporte', id: 'node34', color: '#999' },
          {
            node: 27,
            name: 'Sector agropecuario',
            id: 'node36',
            color: '#999',
          },
          {
            node: 28,
            name: 'Sector comercial y servicios',
            id: 'node8',
            color: '#999',
          },
          { node: 29, name: 'Sector público', id: 'node8', color: '#999' },
          { node: 30, name: 'Sector residencial', id: 'node8', color: '#999' },
          { node: 31, name: 'PEMEX Petroquímica', id: 'node8', color: '#999' },
          {
            node: 32,
            name: 'Otras ramas económicas',
            id: 'node8',
            color: '#999',
          },
          {
            node: 33,
            name: 'Hornos y coquizadoras',
            id: 'node8',
            color: '#999',
          },
          {
            node: 34,
            name: 'Refinerías y despuntadoras',
            id: 'node8',
            color: '#999',
          },
          {
            node: 35,
            name: 'Plantas de gas y fraccionadoras',
            id: 'node8',
            color: '#999',
          },
          {
            node: 36,
            name: 'Transferencia interproductos',
            id: 'node8',
            color: '#999',
          },
          { node: 37, name: 'Coque de carbón', id: 'node8', color: '#cc4125' },
          {
            node: 38,
            name: 'Coque de petróleo',
            id: 'node8',
            color: '#000000',
          },
          { node: 39, name: 'Combustóleo', id: 'node8', color: '#666666' },
          { node: 40, name: 'Queroseno', id: 'node8', color: '#999' },
          { node: 41, name: 'Diésel', id: 'node8', color: '#b7b7b7' },
          { node: 42, name: 'Gasolina', id: 'node8', color: '#cccccc' },
          { node: 43, name: 'GLP', id: 'node8', color: '#c9daf8' },
          { node: 44, name: 'Gas seco', id: 'node8', color: '#6d9eeb' },
          { node: 45, name: 'No energéticos', id: 'node8', color: '#ff00ff' },
          {
            node: 46,
            name: 'Pérdidas en transformación',
            id: 'node8',
            color: '#999',
          },
          {
            node: 47,
            name: 'Centrales eléctricas',
            id: 'node8',
            color: '#00ff00',
          },
          { node: 47, name: 'Electricidad', id: 'node8', color: '#00ff00' },
        ],
        links: [
          {
            source: 'Producción',
            target: 'Carbón',
            value: 192.29,
            color: '#85200c',
          },
          {
            source: 'Producción',
            target: 'Petróleo',
            value: 3821.1,
            color: '#000000',
          },
          {
            source: 'Producción',
            target: 'Gas natural',
            value: 2553,
            color: '#4a86e8',
          },
          {
            source: 'Producción',
            target: 'Condensados',
            value: 140.98,
            color: '#f00',
          },
          {
            source: 'Producción',
            target: 'Nucleoenergía',
            value: 125.62,
            color: '#9900ff',
          },
          {
            source: 'Producción',
            target: 'Geoenergía',
            value: 18.54,
            color: '#783f04',
          },
          {
            source: 'Producción',
            target: 'Hidroenergía',
            value: 96.52,
            color: '#0ff',
          },
          {
            source: 'Producción',
            target: 'Energía eólica',
            value: 70.9,
            color: '#0000ff',
          },
          {
            source: 'Producción',
            target: 'Bagazo de caña',
            value: 99.66,
            color: '#0ff',
          },
          {
            source: 'Producción',
            target: 'Biogas',
            value: 2.53,
            color: '#6d9eeb',
          },
          {
            source: 'Producción',
            target: 'Leña',
            value: 246.62,
            color: '#b45f06',
          },
          {
            source: 'Producción',
            target: 'Energía solar',
            value: 72.75,
            color: '#ff0',
          },

          {
            source: 'Carbón',
            target: 'Exportación',
            value: 0.09,
            color: '#85200c',
          },
          {
            source: 'Carbón',
            target: 'Hornos y coquizadoras',
            value: 27.13,
            color: '#85200c',
          },
          {
            source: 'Carbón',
            target: 'Sector industrial',
            value: 20.95,
            color: '#85200c',
          },
          {
            source: 'Carbón',
            target: 'Centrales eléctricas',
            value: 164.1,
            color: '#85200c',
          },
          { source: 'Carbón', target: 'Otros', value: 1.81, color: '#85200c' },

          {
            source: 'Petróleo',
            target: 'Exportación',
            value: 2509.2,
            color: '#000000',
          },
          {
            source: 'Petróleo',
            target: 'Refinerías y despuntadoras',
            value: 1303.1,
            color: '#000000',
          },
          {
            source: 'Petróleo',
            target: 'Consumo propio',
            value: 16.82,
            color: '#000000',
          },

          {
            source: 'Condensados',
            target: 'Plantas de gas y fraccionadoras',
            value: 7.26,
            color: '#F00',
          },
          {
            source: 'Condensados',
            target: 'Otros',
            value: 133.72,
            color: '#F00',
          },

          {
            source: 'Gas natural',
            target: 'Plantas de gas y fraccionadoras',
            value: 1072.7,
            color: '#4a86e8',
          },
          {
            source: 'Gas natural',
            target: 'Consumo propio',
            value: 641.15,
            color: '#4a86e8',
          },
          {
            source: 'Gas natural',
            target: 'Transferencia interproductos',
            value: 134.9,
            color: '#4a86e8',
          },
          {
            source: 'Gas natural',
            target: 'Otros',
            value: 704.34,
            color: '#4a86e8',
          },

          {
            source: 'Nucleoenergía',
            target: 'Centrales eléctricas',
            value: 125.62,
            color: '#9900ff',
          },

          {
            source: 'Geoenergía',
            target: 'Centrales eléctricas',
            value: 18.539,
            color: '#783f04',
          },

          {
            source: 'Energía eólica',
            target: 'Centrales eléctricas',
            value: 70.9,
            color: '#0000ff',
          },

          {
            source: 'Hidroenergía',
            target: 'Centrales eléctricas',
            value: 95.52,
            color: '#0ff',
          },

          {
            source: 'Bagazo de caña',
            target: 'Otros',
            value: 1.1,
            color: '#f6b26b',
          },
          {
            source: 'Bagazo de caña',
            target: 'Centrales eléctricas',
            value: 57.82,
            color: '#f6b26b',
          },
          {
            source: 'Bagazo de caña',
            target: 'Sector industrial',
            value: 40.6,
            color: '#f6b26b',
          },

          {
            source: 'Biogas',
            target: 'Centrales eléctricas',
            value: 2.53,
            color: '#6d9eeb',
          },

          {
            source: 'Energía solar',
            target: 'Centrales eléctricas',
            value: 56.48,
            color: '#ffff00',
          },
          {
            source: 'Energía solar',
            target: 'Sector industrial',
            value: 1.3,
            color: '#ffff00',
          },
          {
            source: 'Energía solar',
            target: 'Sector comercial y servicios',
            value: 5.96,
            color: '#ffff00',
          },
          {
            source: 'Energía solar',
            target: 'Sector residencial',
            value: 9.01,
            color: '#ffff00',
          },

          {
            source: 'Leña',
            target: 'Sector residencial',
            value: 246.62,
            color: '#b45f06',
          },

          {
            source: 'Hornos y coquizadoras',
            target: 'Coque de carbón',
            value: 18.47,
            color: '#cc4125',
          },
          {
            source: 'Hornos y coquizadoras',
            target: 'Pérdidas en transformación',
            value: 8.66,
            color: '#f9a145',
          },

          {
            source: 'Refinerías y despuntadoras',
            target: 'Coque de petróleo',
            value: 99.27,
            color: '#434343',
          },
          {
            source: 'Refinerías y despuntadoras',
            target: 'Combustóleo',
            value: 417.32,
            color: '#666666',
          },
          {
            source: 'Refinerías y despuntadoras',
            target: 'Diésel',
            value: 220.49,
            color: '#b7b7b7',
          },
          {
            source: 'Refinerías y despuntadoras',
            target: 'Gasolina',
            value: 357.7,
            color: '#cccccc',
          },
          {
            source: 'Refinerías y despuntadoras',
            target: 'GLP',
            value: 8.43,
            color: '#c9daf8',
          },
          {
            source: 'Refinerías y despuntadoras',
            target: 'No energéticos',
            value: 29.4,
            color: '#ff00ff',
          },
          {
            source: 'Refinerías y despuntadoras',
            target: 'Gas seco',
            value: 76.64,
            color: '#6d9eeb',
          },
          {
            source: 'Refinerías y despuntadoras',
            target: 'Pérdidas en transformación',
            value: 57.06,
            color: '#FBFBFB',
          },
          {
            source: 'Refinerías y despuntadoras',
            target: 'Queroseno',
            value: 36.83,
            color: '#999',
          },

          {
            source: 'Plantas de gas y fraccionadoras',
            target: 'Pérdidas en transformación',
            value: 2.24,
            color: '#FBFBFB',
          },
          {
            source: 'Plantas de gas y fraccionadoras',
            target: 'No energéticos',
            value: 70.8,
            color: '#ff00ff',
          },
          {
            source: 'Plantas de gas y fraccionadoras',
            target: 'Gas seco',
            value: 783.46,
            color: '#6d9eeb',
          },
          {
            source: 'Plantas de gas y fraccionadoras',
            target: 'GLP',
            value: 144.27,
            color: '#c9daf8',
          },
          {
            source: 'Plantas de gas y fraccionadoras',
            target: 'Gasolina',
            value: 79.51,
            color: '#cccccc',
          },

          {
            source: 'Transferencia interproductos',
            target: 'Gas seco',
            value: 134.9,
            color: '#6d9eeb',
          },

          {
            source: 'Importación',
            target: 'Carbón',
            value: 21.79,
            color: '#85200c',
          },
          {
            source: 'Importación',
            target: 'Gas seco',
            value: 1890.4,
            color: '#6d9eeb',
          },
          {
            source: 'Importación',
            target: 'Gasolina',
            value: 649.31,
            color: '#cccccc',
          },
          {
            source: 'Importación',
            target: 'GLP',
            value: 283,
            color: '#c9daf8',
          },
          {
            source: 'Importación',
            target: 'Diésel',
            value: 436.23,
            color: '#b7b7b7',
          },
          {
            source: 'Importación',
            target: 'Combustóleo',
            value: 20.2,
            color: '#666666',
          },
          {
            source: 'Importación',
            target: 'Electricidad',
            value: 35.87,
            color: '#00ff00',
          },
          {
            source: 'Importación',
            target: 'Coque de carbón',
            value: 27.2,
            color: '#cc4125',
          },
          {
            source: 'Importación',
            target: 'Coque de petróleo',
            value: 113.55,
            color: '#434343',
          },
          {
            source: 'Importación',
            target: 'Queroseno',
            value: 45.81,
            color: '#999',
          },

          {
            source: 'Coque de carbón',
            target: 'Sector industrial',
            value: 44.56,
            color: '#cc4125',
          },
          {
            source: 'Coque de carbón',
            target: 'Consumo propio',
            value: 1.11,
            color: '#cc4125',
          },

          {
            source: 'Coque de petróleo',
            target: 'Otros',
            value: 48.27,
            color: '#434343',
          },
          {
            source: 'Coque de petróleo',
            target: 'Centrales eléctricas',
            value: 37.84,
            color: '#434343',
          },
          {
            source: 'Coque de petróleo',
            target: 'Exportación',
            value: 0.07,
            color: '#434343',
          },
          {
            source: 'Coque de petróleo',
            target: 'Sector industrial',
            value: 126.63,
            color: '#434343',
          },

          {
            source: 'Combustóleo',
            target: 'Exportación',
            value: 262.87,
            color: '#666666',
          },
          {
            source: 'Combustóleo',
            target: 'Sector industrial',
            value: 11.72,
            color: '#666666',
          },
          {
            source: 'Combustóleo',
            target: 'Consumo propio',
            value: 37.35,
            color: '#666666',
          },
          {
            source: 'Combustóleo',
            target: 'Centrales eléctricas',
            value: 137.69,
            color: '#666666',
          },
          {
            source: 'Combustóleo',
            target: 'Sector transporte',
            value: 2.09,
            color: '#666666',
          },

          {
            source: 'Queroseno',
            target: 'Sector transporte',
            value: 106.68,
            color: '#999',
          },
          { source: 'Queroseno', target: 'Otros', value: 1.51, color: '#999' },

          {
            source: 'Diésel',
            target: 'Sector transporte',
            value: 438.34,
            color: '#b7b7b7',
          },
          {
            source: 'Diésel',
            target: 'Sector agropecuario',
            value: 127.34,
            color: '#b7b7b7',
          },
          {
            source: 'Diésel',
            target: 'Exportación',
            value: 36.6,
            color: '#b7b7b7',
          },
          {
            source: 'Diésel',
            target: 'Centrales eléctricas',
            value: 24.32,
            color: '#b7b7b7',
          },
          {
            source: 'Diésel',
            target: 'Consumo propio',
            value: 41.48,
            color: '#b7b7b7',
          },
          {
            source: 'Diésel',
            target: 'Sector industrial',
            value: 62.2,
            color: '#b7b7b7',
          },

          {
            source: 'Gasolina',
            target: 'Sector transporte',
            value: 1404.2,
            color: '#cccccc',
          },
          {
            source: 'Gasolina',
            target: 'Sector industrial',
            value: 1.47,
            color: '#cccccc',
          },
          {
            source: 'Gasolina',
            target: 'Exportación',
            value: 23.49,
            color: '#cccccc',
          },

          {
            source: 'GLP',
            target: 'Sector transporte',
            value: 61.04,
            color: '#c9daf8',
          },
          {
            source: 'GLP',
            target: 'Sector comercial y servicios',
            value: 61.04,
            color: '#c9daf8',
          },
          {
            source: 'GLP',
            target: 'Sector industrial',
            value: 46.34,
            color: '#c9daf8',
          },
          {
            source: 'GLP',
            target: 'Sector residencial',
            value: 240.14,
            color: '#c9daf8',
          },
          {
            source: 'GLP',
            target: 'Sector agropecuario',
            value: 4.9,
            color: '#c9daf8',
          },
          {
            source: 'GLP',
            target: 'Exportación',
            value: 1.21,
            color: '#c9daf8',
          },
          {
            source: 'GLP',
            target: 'Otras ramas económicas',
            value: 6.62,
            color: '#c9daf8',
          },
          { source: 'GLP', target: 'Otros', value: 14.4, color: '#c9daf8' },

          {
            source: 'Gas seco',
            target: 'Sector industrial',
            value: 438.81,
            color: '#6d9eeb',
          },
          {
            source: 'Gas seco',
            target: 'PEMEX Petroquímica',
            value: 12.05,
            color: '#6d9eeb',
          },
          {
            source: 'Gas seco',
            target: 'Sector comercial y servicios',
            value: 9.5,
            color: '#6d9eeb',
          },
          {
            source: 'Gas seco',
            target: 'Sector transporte',
            value: 1.81,
            color: '#6d9eeb',
          },
          {
            source: 'Gas seco',
            target: 'Exportación',
            value: 2.66,
            color: '#6d9eeb',
          },
          {
            source: 'Gas seco',
            target: 'Sector residencial',
            value: 25.95,
            color: '#6d9eeb',
          },
          {
            source: 'Gas seco',
            target: 'Consumo propio',
            value: 14.4,
            color: '#6d9eeb',
          },
          {
            source: 'Gas seco',
            target: 'Centrales eléctricas',
            value: 1439,
            color: '#6d9eeb',
          },

          {
            source: 'No energéticos',
            target: 'Consumo propio',
            value: 68.06,
            color: '#ff00ff',
          },
          {
            source: 'No energéticos',
            target: 'Otras ramas económicas',
            value: 30.4,
            color: '#ff00ff',
          },
          {
            source: 'No energéticos',
            target: 'Otros',
            value: 1.66,
            color: '#ff00ff',
          },

          {
            source: 'Centrales eléctricas',
            target: 'Electricidad',
            value: 1186.9,
            color: '#00ff00',
          },
          {
            source: 'Centrales eléctricas',
            target: 'Pérdidas en transformación',
            value: 1044.5,
            color: '#f9a145',
          },

          {
            source: 'Electricidad',
            target: 'Sector industrial',
            value: 635.85,
            color: '#00ff00',
          },
          {
            source: 'Electricidad',
            target: 'Consumo propio',
            value: 199.6,
            color: '#00ff00',
          },
          {
            source: 'Electricidad',
            target: 'Sector residencial',
            value: 248.32,
            color: '#00ff00',
          },
          {
            source: 'Electricidad',
            target: 'Sector público',
            value: 14.26,
            color: '#00ff00',
          },
          {
            source: 'Electricidad',
            target: 'Sector transporte',
            value: 3.41,
            color: '#00ff00',
          },
          {
            source: 'Electricidad',
            target: 'Sector comercial y servicios',
            value: 49.48,
            color: '#00ff00',
          },
          {
            source: 'Electricidad',
            target: 'Sector agropecuario',
            value: 50.4,
            color: '#00ff00',
          },
          {
            source: 'Electricidad',
            target: 'Exportación',
            value: 21.44,
            color: '#00ff00',
          },

          {
            source: 'Otros *',
            target: 'Diésel',
            value: 7.56,
            color: '#b7b7b7',
          },
          {
            source: 'Otros *',
            target: 'Gasolina',
            value: 344.06,
            color: '#cccccc',
          },
          {
            source: 'Otros *',
            target: 'Gas seco',
            value: 99.8,
            color: '#6d9eeb',
          },
          {
            source: 'Otros *',
            target: 'Combustóleo',
            value: 14.2,
            color: '#666666',
          },
          {
            source: 'Otros *',
            target: 'Queroseno',
            value: 25.54,
            color: '#999',
          },
        ],
      },
    }
  },
  mounted() {
    const { items3 } = this
    const width = 800
    const height = 600
    const nodeWidth = 15
    const nodeHeight = 20
    const nodePadding = 10

    const ENABLE_LINKS_GRADIENTS = false

    const svg = d3
      .select(this.$refs.svg)
      .attr('viewBox', [0, -20, width, height + 20])

    const { nodes, links } = sankey()
      .nodeId(d => d.name)
      .nodeWidth(nodeWidth)
      .nodeSort(false)
      .nodePadding(nodePadding)
      .extent([
        [1, 1],
        [width, height - nodeHeight],
      ])(items3)

    const link = svg
      .append('g')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.7)
      .selectAll('g')
      .data(links)
      .join('g')
      .style('mix-blend-mode', 'multiply')

    if (ENABLE_LINKS_GRADIENTS) {
      const gradient = link
        .append('linearGradient')
        .attr('id', d => d.id)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', d => d.source.x1)
        .attr('x2', d => d.target.x0)

      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', d => d.source.color)

      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d => d.target.color)
    }

    let tooltip = d3
      .select('#sankey-biomasa')
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('border', '1px solid #333')
      .style('font-family', 'Arial')
      .style('font-size', '10pt')
      .style('font-weight', 'bold')
      .style('max-width', '200px')
      .style('padding', '5px')
      .style('background-color', '#FFF')
      .text('Tooltip')

    link
      .append('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', d => d.color)
      .attr('stroke-width', d => Math.max(1, d.width))
      .attr('opacity', '0.5')
      .on('mouseover', function (d, i) {
        d3.select(this).transition().duration('50').attr('opacity', '1')
        tooltip.style('background-color', i.color)
        tooltip.style('color', i.color === '#000000' ? '#FFF' : '#000')
        tooltip.text(
          '' +
            i.source.name +
            ' → ' +
            i.target.name +
            ' : ' +
            i.value +
            ' MtMS/año'
        )
        tooltip.style('visibility', 'visible')
      })
      .on('mouseout', function () {
        d3.select(this).transition().duration('50').attr('opacity', '0.5')
        tooltip.style('visibility', 'hidden')
      })
      .on('mousemove', function (d) {
        return tooltip
          .style('top', d.pageY + 10 + 'px')
          .style('left', d.pageX + 10 + 'px')
      })

    svg
      .append('g')
      .attr('font-size', 9)
      .attr('font-weight', 'bold')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', d => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => (d.x0 < width / 2 ? 'start' : 'end'))
      .text(d => d.name)
      .attr('class', 'node-text-rect')
      .attr('id', function (d, i) {
        d.id = i
        return 'rect-text-' + i
      })
      .append('tspan')
      .attr('font-size', 9)
      .attr('fill-opacity', 0.7)
      .text(d => ` (${d.value.toLocaleString()})`)

    svg
      .append('g')
      .attr('stroke', '#333')
      .attr('stroke-width', '0.75')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', d => d.x0 + 1)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0 - 2)
      .attr('fill', d => d.color)
      .attr('class', 'node-rect')
      .attr('id', function (d, i) {
        d.id = i
        return 'rect-' + i
      })
      .on('mouseover', function (d, i) {
        let nodeHiglight = []

        link
          .transition()
          .duration(300)
          .style('stroke-opacity', function (l) {
            if (l.source.index === i.index || l.target.index === i.index) {
              nodeHiglight.push(l.target.id)
              nodeHiglight.push(l.source.id)
            }

            return l.source.index === i.index || l.target.index === i.index
              ? 1
              : 0.2
          })

        tooltip.style('background-color', i.color)
        tooltip.style('color', i.color === '#000000' ? '#FFF' : '#000')
        tooltip.text(
          '' + i.name + ' : ' + i.value.toLocaleString() + ' MtMS/año'
        )
        tooltip.style('visibility', 'visible')

        d3.selectAll('.node-rect').style('opacity', 0.2)
        d3.selectAll('.node-text-rect').style('opacity', 0.2)
        for (let i = 0; i < nodeHiglight.length; i++) {
          d3.select('#rect-' + nodeHiglight[i]).style('opacity', 1)
          d3.select('#rect-text-' + nodeHiglight[i]).style('opacity', 1)
        }
      })
      .on('mouseleave', function () {
        link.transition().duration(300).style('stroke-opacity', 0.5)

        d3.selectAll('.node-text-rect').style('opacity', 1)
        d3.selectAll('.node-rect').style('opacity', 1)
        tooltip.style('visibility', 'hidden')
      })
      .on('mousemove', function (d) {
        return tooltip
          .style('top', d.pageY + 10 + 'px')
          .style('left', d.pageX + 10 + 'px')
      })
  },
}
</script> -->

<style scoped lang="scss">
svg {
  padding-inline: 2rem;
}
</style>
