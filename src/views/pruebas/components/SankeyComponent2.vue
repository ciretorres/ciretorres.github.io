<script setup>
import * as d3 from 'd3'
import { sankey } from 'd3-sankey'
import { sankeyLinkHorizontal } from 'd3-sankey'

import { onMounted, ref } from 'vue'

const svgRef = ref('')

// const items = {
//   nodes: [
//     {
//       node: 9,
//       name: 'Pino',
//       id: 'node9',
//       color: '#846026',
//       description:
//         'Este valor se estimó en función del crecimiento anual de biomasa y de la capa de Uso de Suelo y Vegetación, Serie VI de INEGI, 2016. Contempla la productividad anual de los bosques de coníferas, de los cuales se obtiene leña para el uso residencial y otra parte es destinada a la producción forestal nacional y exportaciones autorizadas por SEMARNAT.',
//       ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); Uso de Suelo y Vegetación Serie VI de INEGI (2016).',
//     },
//     {
//       node: 10,
//       name: 'Encino',
//       id: 'node10',
//       color: '#f69633',
//       description:
//         'Este valor se estimó en función del crecimiento anual de biomasa y de la capa de Uso de Suelo y Vegetación, Serie VI de INEGI, 2016. Contempla la productividad anual de los bosques de encino, de los cuales se obtiene carbón vegetal y leña. Asimismo, los encinos son utilizados para distintos productos, reportados en la producción forestal nacional SEMARNAT, 2018.',
//       ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); Uso de Suelo y Vegetación Serie VI de INEGI (2016).',
//     },
//     {
//       node: 11,
//       name: 'Tropicales 1',
//       id: 'node11',
//       color: '#a7bd14',
//       description:
//         'Este valor se estimó en función del crecimiento anual de biomasa y de la capa de Uso de Suelo y Vegetación, Serie VI de INEGI, 2016. Contempla la productividad anual de las especies leñosas en las selvas. De estas especies, se obtienen distintos productos con fines energéticos, como la leña y el carbón vegetal, también, las maderas tropicales son utilizadas para elaboración y exportación de distintos productos reportados en la producción forestal nacional, SEMARNAT, 2018.',
//       ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); Uso de Suelo y Vegetación Serie VI de INEGI (2016).',
//     },
//     {
//       node: 12,
//       name: 'Matorrales',
//       id: 'node12',
//       color: '#f95e2c',
//       description:
//         'Este valor se estimó en función del crecimiento anual de biomasa y de la capa de Uso de Suelo y Vegetación, Serie VI de INEGI, 2016. Contempla la productividad anual de los matorrales. Es importante mencionar que en la literatura no se contempla el uso de esta vegetación con fines energéticos, pero en consultas de expertos nos dicen que este tipo de vegetación se usa como leña y para la producción de carbón vegetal.',
//       ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); Uso de Suelo y Vegetación Serie VI de INEGI (2016); Consulta de expertos.',
//     },
//     {
//       node: 7,
//       name: 'Aserraderos',
//       id: 'node7',
//       color: '#999',
//       description:
//         'El valor para los aserraderos considera la biomasa que proviene principalmente de la productividad de bosques, selvas y árboles frutales, así como la importación de carbón, leña y madera en rollo (SEMARNAT, 2018). La biomasa transformada se transporta al sector industrial como: aserrín y otros, astillas y pellets. Los productos maderables y no maderables son destinados a usos no energéticos.',
//       ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
//     },
//     {
//       node: 19,
//       name: 'Leña',
//       id: 'node20',
//       color: '#999',
//       description:
//         'Se refiere a la madera cortada con instrumentos afilados, en trozos más largos y gruesos que las astillas de madera. Este producto proviene principalmente del manejo de bosques de encino, ecosistemas tropicales y bosques de coníferas. Sus principales usos se encuentran en el sector residencial (cocción y calefacción), comercio e industria (venta de alimentos preparados, calefacción y otros).',
//       ref: 'Serrano-Medrano et. al., (2014); Masera et. al., (2012) y BCS/Línea 4',
//     },
//     {
//       node: 5,
//       name: 'Importación de carbón y leña',
//       id: 'node5',
//       color: '#646e12',
//       description:
//         'Los valores de importación fueron tomados del Anuario Estadístico de la Producción Forestal, elaborado por SEMARNAT en 2018, en donde se reporta la cantidad de carbón y leña que entra al país.',
//       ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
//     },
//     {
//       node: 6,
//       name: 'Importación de madera en rollo',
//       id: 'node6',
//       color: '#acb83f',
//       description:
//         'Los valores de importación fueron tomados del Anuario Estadístico de la Producción Forestal, elaborado por SEMARNAT en 2018, en donde se reporta la cantidad de madera en rollo que entra al país. Estos valores se tomaron en cuenta, ya que al pasar por el aserradero generan residuos que se pueden llegar a convertir en biocombustibles sólidos.',
//       ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
//     },
//     {
//       node: 13,
//       name: 'Caña',
//       id: 'node13',
//       color: '#198d26',
//       description:
//         'Se considera el cultivo de caña por separado del resto de cultivos anuales por contar con registros oficiales de producción y cuantificación de bagazo generado. La cantidad de rastrojo generado fue estimada por modelos de productividad y comparada con los registros oficiales.',
//       ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); SIAP (2022)',
//     },
//     {
//       node: 14,
//       name: 'Maíz y otros',
//       id: 'node14',
//       color: '#198d26',
//       description:
//         'Este valor considera los residuos generados por los cultivos de maíz, trigo y sorgo, que representan el 55% de la producción de cultivos anuales a nivel nacional. La estimación de residuos se generó con mapas de productividad media anual por municipio.',
//       ref: 'PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018); SIAP (2022)',
//     },
//     {
//       node: 17,
//       name: 'Árboles frutales',
//       id: 'node17',
//       color: '#d0df15',
//       description:
//         'Se considera el potencial máximo de 64 PJ/año proveniente de podas anuales de árboles de aguacate, mango, cítricos, nuez, manzana, durazno, uva y guayaba. Se contempla una producción media de 4 toneladas de materia seca de podas por hectárea, y una disponibilidad de biomasa para energía del 60%.',
//       ref: 'Tauro et. al., (2018)',
//     },
//     {
//       node: 16,
//       name: 'Agave',
//       id: 'node16',
//       color: '#acc203',
//       description:
//         'Este valor considera los valores reportados de generación de residuos para los cultivos de bagazo de maguey.',
//       ref: 'Valdez-Vazquez, (2010)',
//     },
//     {
//       node: 20,
//       name: 'Pino y otras coníferas',
//       id: 'node19',
//       color: '#999',
//       description:
//         'Este valor contempla la producción forestal de pino y otras coníferas que son enviadas a las industrias de transformación primaria para la elaboración de diferentes productos forestales y sus derivados. A la producción registrada por SEMARNAT se suma un porcentaje de madera proveniente de los aprovechamientos forestales no reportados.',
//       ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
//     },
//     {
//       node: 22,
//       name: 'Encino y otras latifoliadas',
//       id: 'node22',
//       color: '#999',
//       description:
//         'Este valor contempla la producción forestal de encino y otras latifoliadas que son enviadas a las industrias de transformación primaria para la elaboración de diferentes productos forestales y sus derivados. A la producción registrada por SEMARNAT se suma un porcentaje de madera proveniente de los aprovechamientos forestales no reportados.',
//       ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
//     },
//     {
//       node: 23,
//       name: 'Hornos de carbón',
//       id: 'node23',
//       color: '#999',
//       description:
//         'El porcentaje de participación de la materia prima que llega a los hornos de carbón proviene de mayor a menor medida: encino, tropicales y matorrales. El carbón vegetal que sale de los hornos tiene un uso energético principalmente en el sector residencial, comercial y exportaciones.',
//       ref: 'Arias, (2020); consulta de expertos',
//     },
//     {
//       node: 24,
//       name: 'Tropicales',
//       id: 'node24',
//       color: '#999',
//       description:
//         'Este valor contempla la producción forestal de especies tropicales que son enviadas a las industrias de transformación primaria para la elaboración de diferentes productos forestales y sus derivados. A la producción registrada por SEMARNAT se suma un porcentaje de madera proveniente de los aprovechamientos forestales no reportados.',
//       ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
//     },
//     {
//       node: 25,
//       name: 'Bagazo',
//       id: 'node25',
//       color: '#999',
//       description:
//         'El bagazo incluye los cultivos de agave y caña principalmente. Su principal uso es energético como combustible en las industrias donde se generan los residuos (ingenios azucareros y tequileras).',
//       ref: 'BCS/Línea 4; PLATAFORMA GEO-ESPACIAL del Cluster de biocombustibles sólidos (2018)',
//     },
//     {
//       node: 26,
//       name: 'RAC',
//       id: 'node26',
//       color: '#999',
//       description:
//         'Los rastrojos o residuos agrícolas de cosecha (RAC) son subproductos derivados de las actividades agrícolas, y se les considera como la porción del cultivo cosechado (hojas, tallos, espigas y brácteas de la mazorca) que queda después de extraer el grano. La producción nacional es de 45 MtMS, provenientes de diez cultivos; entre ellos, los principales son: el maíz, el sorgo, el trigo y la cebada.\n\nEl consumo nacional de rastrojos se estimó en 43.3 millones de toneladas, principalmente para usos no energéticos como insumo alimenticio en el sector pecuario (bovinos, ovinos y caprinos, principalmente). Si bien los rastrojos son empleados principalmente como forraje para el ganado, estos tienen otros usos: se emplean como mejoradores de suelo al dejarlos como cobertura, como materiales de construcción. Por otra parte, está su uso en los fogones tradicionales y a nivel industrial como biocombustibles.',
//       ref: 'Reyes-Muro et. al., (2013)',
//     },
//     {
//       node: 28,
//       name: 'Olote',
//       id: 'node27',
//       color: '#999',
//       description:
//         'Es un residuo o subproducto agrícola que se genera en grandes cantidades en el proceso de separación del grano de la mazorca. Entre los usos del olote que han sido reportados en la literatura se encuentran la aplicación como forraje para rumiantes y soporte para disminuir la erosión en la tierra.',
//       ref: 'Tauro et. al., (2018); Córdoba et. al., (2013).',
//     },
//     {
//       node: 29,
//       name: 'Carbón vegetal',
//       id: 'node29',
//       color: '#999',
//       description:
//         'Biocombustible sólido derivado de la carbonización, la pirólisis o la torrefacción de combustibles forestales. Este producto proviene principalmente del manejo de bosques de encino y zonas tropicales. El carbón vegetal es usado en el sector residencial y comercial, principalmente para la cocción de alimentos.',
//       ref: 'Serrano-Medrano et. al., (2014); BCS/Línea 4',
//     },
//     {
//       node: 30,
//       name: 'Aserrín',
//       id: 'node30',
//       color: '#999',
//       description:
//         'Se refiere a las partículas finas de 1 a 5 mm que se derivan del aserrado de madera, se usa principalmente en pequeñas industrias, como combustible o mezcla para la fabricación de ladrillos, asimismo, tiene una gran cantidad de usos no energéticos, como la fabricación de aglomerados, usos veterinarios, y en diversos comercios es usado para limpieza (carnicerías, productores de aceite, etc).',
//       ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
//     },
//     {
//       node: 31,
//       name: 'Astillas',
//       id: 'node31',
//       color: '#999',
//       description:
//         'Las astillas son trozos de madera de pequeñas dimensiones que quedan después de la generación de productos forestales en la industria del procesamiento de la madera. Asimismo, los pellets son biocombustibles sólidos densificados obtenidos de biomasa pulverizada que se genera en los aserraderos. Pueden tener diferentes usos, entre los cuales destaca, el energético en la industria y usos no energéticos como camas para los animales de las veterinarias.',
//       ref: 'BCS/Línea 4; Arias, (2020)',
//     },
//     {
//       node: 32,
//       name: 'Otros productos maderables y no maderables',
//       id: 'node31',
//       color: '#999',
//       description:
//         'Los otros tipos de productos maderables contemplan materiales leñosos como: escuadría, durmientes, chapa y triplay. Por otro lado, los principales productos no maderables son: resinas, gomas, rizomas, tierra de monte, fibras y ceras. El destino de ambos productos son principalmente para usos no energéticos y exportación.',
//       ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
//     },
//     {
//       node: 35,
//       name: 'Residencial',
//       id: 'node35',
//       color: '#999',
//       description:
//         'Este sector considera el uso de dos biocombustibles sólidos (BCS)*: leña y carbón vegetal. El valor de ambos se consideró a partir de la investigación realizada por (Serrano-Medrano et. al., 2014), en la que se estimó el consumo anual de éstos. Se realizó un análisis detallado del consumo específico* por vivienda y usuarios, así como la saturación de consumidores* de leña y carbón vegetal por tamaño de localidad. Asimismo, la demanda de Pellets es muy baja en el sector residencial para calefacción de ambiente en el Norte de México (<10 toneladas/año) (Arias, 2020).',
//       ref: 'Serrano-Medrano et. al., (2014); Arias, (2020)',
//     },
//     {
//       node: 33,
//       name: 'Comercio',
//       id: 'node33',
//       color: '#999',
//       description:
//         'Descripción: Los valores se obtuvieron a partir del estudio de investigación desarrollado en campo por la Línea 4 del Clúster de BCS. La leña es el principal BCS utilizado en la cocción de alimentos (venta de alimentos preparados, tortillerías, hospedaje) y calefacción de ambiente (oficinas de gobierno y hospedaje), seguida del carbón vegetal (venta de alimentos preparados) (CBCS L-4). Asimismo, se consideraron los valores de carbón vegetal en comercios formales e informales, reportados por (Serrano-Medrano et. al., 2014).',
//       ref: 'CBCS L-4; Serrano-Medrano et. al., (2014)',
//     },
//     {
//       node: 34,
//       name: 'Industrial',
//       id: 'node34',
//       color: '#999',
//       description:
//         'Este sector considera el uso de diferentes tipos de BCS. La leña es el principal BCS utilizado en la pequeña y mediana industria: lácteos, ladrilleras y mezcaleras (CBCS L-4; Masera et. al., 2012). En la gran industria se utilizan principalmente los siguientes BCS: ingenios azucareros (bagazo de caña, astillas), tequileras (bagazo de agave, astillas), cerveceras (astillas) (CBCS L-4; Arias, 2020).',
//       ref: 'CBCS L-4; Masera et. al., (2012); Arias, (2020)',
//     },
//     {
//       node: 34,
//       name: 'Pellets',
//       id: 'node35',
//       color: '#999',
//       description:
//         'Este sector considera el uso de diferentes tipos de BCS. La leña es el principal BCS utilizado en la pequeña y mediana industria: lácteos, ladrilleras y mezcaleras (CBCS L-4; Masera et. al., 2012). En la gran industria se utilizan principalmente los siguientes BCS: ingenios azucareros (bagazo de caña, astillas), tequileras (bagazo de agave, astillas), cerveceras (astillas) (CBCS L-4; Arias, 2020).',
//       ref: 'CBCS L-4; Masera et. al., (2012); Arias, (2020)',
//     },
//     {
//       node: 36,
//       name: 'Usos no energéticos',
//       id: 'node36',
//       color: '#999',
//       description:
//         'Este valor considera los RAC que se utilizan para forraje, incorporación en terrenos agrícolas, camas para el ganado y sustrato en la producción de hongos comestibles. El aserrín se utiliza para la fabricación de aglomerados, usos veterinarios, y en diversos comercios es usado para limpieza (carnicerías, productores de aceite, etc). Los usos no energéticos principales de las astillas y pellets son en camas para los animales de las veterinarias.',
//       ref: 'Reyes-Muro et. al., (2013); BCS/Línea 4; Arias, (2020); Consulta de expertos; Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
//     },
//     {
//       node: 8,
//       name: 'Exportaciones',
//       id: 'node8',
//       color: '#999',
//       description:
//         'Se consideran los valores reportados por el Anuario Estadístico Forestal, SEMARNAT, 2018. Los principales productos exportados son ventanas, puertas, tableros, cajas; asimismo se exporta leña y carbón vegetal.',
//       ref: 'Anuario Estadístico de la Producción Forestal, SEMARNAT (2018)',
//     },
//   ],
//   links: [
//     {
//       source: 'Pino',
//       target: 'Leña',
//       value: 51.7,
//       color: '#846026',
//     },
//     {
//       source: 'Pino',
//       target: 'Pino y otras coníferas',
//       value: 124.9,
//       color: '#846026',
//     },
//     {
//       source: 'Encino',
//       target: 'Encino y otras latifoliadas',
//       value: 129,
//       color: '#f69633',
//     },
//     {
//       source: 'Encino',
//       target: 'Hornos de carbón',
//       value: 47.1,
//       color: '#f69633',
//     },
//     {
//       source: 'Encino',
//       target: 'Leña',
//       value: 103.4,
//       color: '#f69633',
//     },
//     {
//       source: 'Tropicales 1',
//       target: 'Hornos de carbón',
//       value: 4.2,
//       color: '#a7bd14',
//     },
//     {
//       source: 'Tropicales 1',
//       target: 'Leña',
//       value: 77.6,
//       color: '#a7bd14',
//     },
//     {
//       source: 'Tropicales 1',
//       target: 'Tropicales',
//       value: 35.7,
//       color: '#a7bd14',
//     },
//     {
//       source: 'Matorrales',
//       target: 'Hornos de carbón',
//       value: 1.4,
//       color: '#f95e2c',
//     },
//     {
//       source: 'Matorrales',
//       target: 'Leña',
//       value: 25.9,
//       color: '#f95e2c',
//     },
//     {
//       source: 'Importación de carbón y leña',
//       target: 'Carbón vegetal',
//       value: 0.19,
//       color: '#646e12',
//     },
//     {
//       source: 'Importación de carbón y leña',
//       target: 'Leña',
//       value: 0.11,
//       color: '#646e12',
//     },
//     {
//       source: 'Importación de madera en rollo',
//       target: 'Aserraderos',
//       value: 0.32,
//       color: '#acb83f',
//     },
//     {
//       source: 'Pino y otras coníferas',
//       target: 'Aserraderos',
//       value: 83,
//       color: '#b6906e',
//     },
//     {
//       source: 'Pino y otras coníferas',
//       target: 'Astillas',
//       value: 6,
//       color: '#b6906e',
//     },
//     {
//       source: 'Pino y otras coníferas',
//       target: 'Leña',
//       value: 35.9,
//       color: '#b6906e',
//     },
//     {
//       source: 'Encino y otras latifoliadas',
//       target: 'Aserraderos',
//       value: 47.9,
//       color: '#b6906e',
//     },
//     {
//       source: 'Encino y otras latifoliadas',
//       target: 'Hornos de carbón',
//       value: 45.3,
//       color: '#b6906e',
//     },
//     {
//       source: 'Encino y otras latifoliadas',
//       target: 'Leña',
//       value: 34,
//       color: '#b6906e',
//     },
//     {
//       source: 'Tropicales',
//       target: 'Aserraderos',
//       value: 12.9,
//       color: '#656c43',
//     },
//     {
//       source: 'Tropicales',
//       target: 'Hornos de carbón',
//       value: 11.1,
//       color: '#656c43',
//     },
//     {
//       source: 'Tropicales',
//       target: 'Leña',
//       value: 6.7,
//       color: '#656c43',
//     },
//     {
//       source: 'Caña',
//       target: 'Bagazo',
//       value: 52.65,
//       color: '#198d26',
//     },
//     {
//       source: 'Maíz y otros',
//       target: 'Olote',
//       value: 39.6,
//       color: '#198e21',
//     },
//     {
//       source: 'Árboles frutales',
//       target: 'Aserraderos',
//       value: 6.8,
//       color: '#d0df15',
//     },
//     {
//       source: 'Árboles frutales',
//       target: 'Leña',
//       value: 20.3,
//       color: '#e9ef7f',
//     },
//     {
//       source: 'Agave',
//       target: 'Bagazo',
//       value: 22.5,
//       color: '#acc203',
//     },
//     {
//       source: 'Hornos de carbón',
//       target: 'Carbón vegetal',
//       value: 109.1,
//       color: '#a04e04',
//     },
//     {
//       source: 'Aserraderos',
//       target: 'Aserrín',
//       value: 1.2,
//       color: '#fb5b29',
//     },
//     {
//       source: 'Aserraderos',
//       target: 'Astillas',
//       value: 7.7,
//       color: '#fc6e46',
//     },
//     {
//       source: 'Aserraderos',
//       target: 'Leña',
//       value: 31.4,
//       color: '#fc6e46',
//     },
//     {
//       source: 'Aserraderos',
//       target: 'Otros productos maderables y no maderables',
//       value: 110,
//       color: '#522007',
//     },
//     {
//       source: 'Leña',
//       target: 'Comercio',
//       value: 13,
//       color: '#d39e93',
//     },
//     {
//       source: 'Leña',
//       target: 'Exportaciones',
//       value: 2.8,
//       color: '#845f29',
//     },
//     {
//       source: 'Leña',
//       target: 'Industrial',
//       value: 27.4,
//       color: '#ef3f11',
//     },
//     {
//       source: 'Leña',
//       target: 'Residencial',
//       value: 343.8,
//       color: '#845f29',
//     },
//     {
//       source: 'Carbón vegetal',
//       target: 'Comercio',
//       value: 6.3,
//       color: '#d39e93',
//     },
//     {
//       source: 'Carbón vegetal',
//       target: 'Exportaciones',
//       value: 15.7,
//       color: '#9b5205',
//     },
//     {
//       source: 'Carbón vegetal',
//       target: 'Industrial',
//       value: 0.3,
//       color: '#f33e03',
//     },
//     {
//       source: 'Carbón vegetal',
//       target: 'Residencial',
//       value: 87,
//       color: '#9b5205',
//     },
//     {
//       source: 'Astillas',
//       target: 'Industrial',
//       value: 13.7,
//       color: '#fb3a04',
//     },
//     {
//       source: 'Aserrín',
//       target: 'Pellets',
//       value: 9,
//       color: '#b05e06',
//     },
//     {
//       source: 'Aserrín',
//       target: 'Industrial',
//       value: 1.2,
//       color: '#b05e06',
//     },
//     {
//       source: 'Pellets',
//       target: 'Comercio',
//       value: 14,
//       color: '#b05e06',
//     },
//     {
//       source: 'Pellets',
//       target: 'Residencial',
//       value: 13,
//       color: '#b05e06',
//     },
//     {
//       source: 'Bagazo',
//       target: 'Pellets',
//       value: 18,
//       color: '#1d8b26',
//     },
//     {
//       source: 'Bagazo',
//       target: 'Industrial',
//       value: 75.2,
//       color: '#1d8b26',
//     },
//     {
//       source: 'Olote',
//       target: 'Residencial',
//       value: 39.6,
//       color: '#198d23',
//     },
//   ],
// }

const items = {
  nodes: [
    { node: 0, name: 'node0', id: 'node0', color: '#FFF' },
    { node: 1, name: 'node1', id: 'node1', color: '#FFF' },
    { node: 2, name: 'node2', id: 'node2', color: '#FFF' },
    { node: 3, name: 'node3', id: 'node3', color: '#FFF' },
    { node: 4, name: 'node4', id: 'node4', color: '#FFF' },
    { node: 5, name: 'node5', id: 'node5', color: '#FFF' },
    { node: 6, name: 'node6', id: 'node6', color: '#FFF' },
    { node: 7, name: 'node7', id: 'node7', color: '#FFF' },
    { node: 8, name: 'node8', id: 'node8', color: '#FFF' },
    { node: 9, name: 'node9', id: 'node9', color: '#FFF' },
    { node: 10, name: 'node10', id: 'node10', color: '#FFF' },
    { node: 11, name: 'node11', id: 'node11', color: '#FFF' },
    { node: 12, name: 'node12', id: 'node12', color: '#FFF' },
    { node: 13, name: 'node13', id: 'node13', color: '#FFF' },
    { node: 14, name: 'node14', id: 'node14', color: '#FFF' },
    { node: 15, name: 'Azcapotzalco', id: 'node15', color: '#FFF' },
    { node: 16, name: 'node16', id: 'node16', color: '#FFF' },
    { node: 17, name: 'node17', id: 'node17', color: '#FFF' },
    { node: 18, name: 'node18', id: 'node18', color: '#FFF' },
    { node: 19, name: 'node19', id: 'node19', color: '#FFF' },
    { node: 20, name: 'node20', id: 'node20', color: '#FFF' },
    { node: 21, name: 'node21', id: 'node21', color: '#FFF' },
    { node: 22, name: 'node22', id: 'node22', color: '#FFF' },
    { node: 23, name: 'node23', id: 'node23', color: '#FFF' },
    { node: 24, name: 'node24', id: 'node24', color: '#FFF' },
    { node: 25, name: 'node25', id: 'node25', color: '#FFF' },
    { node: 26, name: 'node26', id: 'node26', color: '#FFF' },
    { node: 27, name: 'Transferencia', id: 'node27', color: '#FFF' },
    { node: 28, name: 'node28', id: 'node28', color: '#FFF' },
    { node: 29, name: 'node29', id: 'node29', color: '#FFF' },
    { node: 30, name: 'node30', id: 'node30', color: '#FFF' },
    { node: 31, name: 'node31', id: 'node31', color: '#FFF' },
    { node: 32, name: 'Disposición', id: 'node32', color: '#FFF' },
    { node: 33, name: 'Composta', id: 'node33', color: '#FFF' },
    { node: 34, name: 'Compactadora', id: 'node34', color: '#FFF' },
    { node: 35, name: 'node35', id: 'node35', color: '#FFF' },
    { node: 36, name: 'Selección', id: 'node36', color: '#FFF' },
    // experimento
    { node: 37, name: 'Recuperación', id: 'node37', color: '#FFF' },
    { node: 38, name: 'node38', id: 'node38', color: '#FFF' },
  ],
  links: [
    { source: 'node0', target: 'node16', value: 1, color: '#EFF' },
    { source: 'node0', target: 'node17', value: 1, color: '#EFF' },
    { source: 'node1', target: 'node17', value: 1, color: '#EFF' },
    { source: 'node2', target: 'node17', value: 1, color: '#EFF' },
    { source: 'node3', target: 'node17', value: 1, color: '#EFF' },
    { source: 'node3', target: 'node18', value: 1, color: '#EFF' },
    { source: 'node4', target: 'node18', value: 1, color: '#EFF' },
    { source: 'node4', target: 'node19', value: 1, color: '#EFF' },
    { source: 'node5', target: 'node19', value: 1, color: '#EFF' },
    { source: 'node6', target: 'node19', value: 1, color: '#EFF' },
    { source: 'node6', target: 'node20', value: 1, color: '#EFF' },
    { source: 'node7', target: 'node20', value: 1, color: '#EFF' },
    { source: 'node8', target: 'node21', value: 1, color: '#EFF' },
    { source: 'node9', target: 'node22', value: 1, color: '#EFF' },
    { source: 'node10', target: 'node23', value: 1, color: '#EFF' },
    { source: 'node11', target: 'node24', value: 1, color: '#EFF' },
    { source: 'node12', target: 'node24', value: 1, color: '#EFF' },
    { source: 'node13', target: 'node25', value: 1, color: '#EFF' },
    { source: 'node14', target: 'node26', value: 1, color: '#EFF' },
    {
      source: 'Azcapotzalco',
      target: 'Transferencia',
      value: 1,
      color: '#EFF',
    },
    { source: 'node16', target: 'node28', value: 0, color: 'transparent' },
    { source: 'node17', target: 'node28', value: 1, color: '#ED4197' },
    { source: 'node17', target: 'node29', value: 1, color: '#ED4197' },
    { source: 'node17', target: 'node30', value: 1, color: '#ED4197' },
    { source: 'node18', target: 'node28', value: 1, color: '#ED4197' },
    { source: 'node18', target: 'node29', value: 1, color: '#ED4197' },
    { source: 'node19', target: 'node28', value: 1, color: '#ED4197' },
    { source: 'node19', target: 'node29', value: 1, color: '#ED4197' },
    { source: 'node19', target: 'node31', value: 1, color: '#ED4197' },
    { source: 'node19', target: 'Disposición', value: 1, color: '#ED4197' },
    { source: 'node20', target: 'node28', value: 1, color: '#ED4197' },
    { source: 'node20', target: 'node29', value: 1, color: '#ED4197' },
    { source: 'node20', target: 'node30', value: 1, color: '#ED4197' },
    { source: 'node21', target: 'node28', value: 1, color: '#ED4197' },
    { source: 'node21', target: 'node29', value: 1, color: '#ED4197' },
    { source: 'node21', target: 'node30', value: 1, color: '#ED4197' },
    { source: 'node22', target: 'node28', value: 1, color: '#ED4197' },
    { source: 'node22', target: 'node29', value: 1, color: '#ED4197' },
    { source: 'node22', target: 'node31', value: 1, color: '#ED4197' },
    { source: 'node23', target: 'node28', value: 1, color: '#ED4197' },
    { source: 'node23', target: 'node29', value: 1, color: '#ED4197' },
    { source: 'node23', target: 'node30', value: 1, color: '#ED4197' },
    { source: 'node23', target: 'node31', value: 1, color: '#ED4197' },
    { source: 'node24', target: 'node28', value: 1, color: '#ED4197' },
    { source: 'node24', target: 'node29', value: 1, color: '#ED4197' },
    { source: 'node24', target: 'node30', value: 1, color: '#ED4197' },
    { source: 'node24', target: 'node31', value: 1, color: '#ED4197' },
    { source: 'node25', target: 'node28', value: 1, color: '#ED4197' },
    { source: 'node25', target: 'node29', value: 1, color: '#ED4197' },
    { source: 'node25', target: 'node30', value: 1, color: '#ED4197' },
    { source: 'node25', target: 'node31', value: 1, color: '#ED4197' },
    { source: 'node26', target: 'node28', value: 1, color: '#ED4197' },
    { source: 'node26', target: 'node29', value: 1, color: '#ED4197' },
    { source: 'node26', target: 'node30', value: 1, color: '#ED4197' },
    { source: 'node26', target: 'node31', value: 1, color: '#ED4197' },
    { source: 'Transferencia', target: 'node28', value: 1, color: '#ED4197' },
    { source: 'Transferencia', target: 'node29', value: 1, color: '#ED4197' },
    { source: 'Transferencia', target: 'node30', value: 1, color: '#ED4197' },
    { source: 'Transferencia', target: 'node31', value: 1, color: '#ED4197' },
    { source: 'node17', target: 'Composta', value: 1, color: '#EFF' },
    { source: 'node18', target: 'Composta', value: 1, color: '#EFF' },
    { source: 'node19', target: 'Composta', value: 1, color: '#EFF' },
    { source: 'node20', target: 'Composta', value: 1, color: '#EFF' },
    { source: 'node21', target: 'Composta', value: 1, color: '#EFF' },
    { source: 'node22', target: 'Composta', value: 1, color: '#EFF' },
    { source: 'node23', target: 'Composta', value: 1, color: '#EFF' },
    { source: 'node24', target: 'Composta', value: 1, color: '#EFF' },
    { source: 'node25', target: 'Composta', value: 1, color: '#EFF' },
    { source: 'node26', target: 'Composta', value: 1, color: '#EFF' },
    { source: 'Transferencia', target: 'Composta', value: 1, color: '#EFF' },
    // { source: 'node17', target: 'node34', value: 536, color: 'transparent' },
    { source: 'node17', target: 'node35', value: 1, color: '#BA3377' },
    { source: 'node17', target: 'Selección', value: 1, color: '#BA3377' },
    { source: 'node18', target: 'node35', value: 1, color: '#BA3377' },
    { source: 'node18', target: 'Selección', value: 1, color: '#BA3377' },
    { source: 'node19', target: 'node35', value: 1, color: '#BA3377' },
    { source: 'node19', target: 'Selección', value: 1, color: '#BA3377' },
    { source: 'node20', target: 'node35', value: 1, color: '#BA3377' },
    { source: 'node20', target: 'Selección', value: 1, color: '#BA3377' },
    { source: 'node21', target: 'node35', value: 1, color: '#BA3377' },
    { source: 'node21', target: 'Selección', value: 1, color: '#BA3377' },
    { source: 'node22', target: 'node35', value: 1, color: '#BA3377' },
    { source: 'node22', target: 'Selección', value: 1, color: '#BA3377' },
    { source: 'node23', target: 'node35', value: 1, color: '#BA3377' },
    { source: 'node23', target: 'Selección', value: 1, color: '#BA3377' },
    { source: 'node24', target: 'node35', value: 1, color: '#BA3377' },
    { source: 'node24', target: 'Selección', value: 1, color: '#BA3377' },
    { source: 'node25', target: 'node35', value: 1, color: '#BA3377' },
    { source: 'node25', target: 'Selección', value: 1, color: '#BA3377' },
    { source: 'node26', target: 'node35', value: 1, color: '#BA3377' },
    { source: 'Transferencia', target: 'node35', value: 1, color: '#BA3377' },
    {
      source: 'Transferencia',
      target: 'Selección',
      value: 1,
      color: '#BA3377',
    },
    { source: 'node35', target: 'Recuperación', value: 1, color: '#EFF' },
    { source: 'Selección', target: 'Recuperación', value: 1, color: '#EFF' },
  ],
}

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
  // console.log(links)

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

  // Coloca texto alado del nodo rectángulo
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

  // Coloca el nodo rectángulo
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
    <h2>Sankey 2</h2>
    <div
      class="container"
      id="sankey-bio"
    >
      <svg ref="svgRef"></svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
svg {
  padding-inline: 2rem;
}
</style>
