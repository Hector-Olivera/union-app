import { LEGAL } from '@constants/legal';
import type { LegalDocument } from '@/types/legal';

export const getTermsDocument = (): LegalDocument => {
  const { appName, minAge, jurisdiction, contactEmail } = LEGAL;
  return {
    title: 'Términos y Condiciones',
    sections: [
      {
        heading: '1. Aceptación de los términos',
        paragraphs: [
          `Al crear una cuenta o usar ${appName} (la "App"), el usuario acepta estos Términos y Condiciones y la Política de Privacidad. Quien no esté de acuerdo no debe usar la App.`,
        ],
      },
      {
        heading: '2. Quiénes pueden usar la App',
        paragraphs: [
          `La App está destinada a personas mayores de ${minAge} años con capacidad legal para contratar.`,
          'Cada usuario es responsable de la confidencialidad de sus credenciales y de toda la actividad realizada desde su cuenta. Debe informar de inmediato cualquier uso no autorizado.',
          'Los datos de registro deben ser veraces y mantenerse actualizados.',
        ],
      },
      {
        heading: '3. Qué ofrece la App',
        paragraphs: [
          'La App es una plataforma que permite crear una tienda virtual, publicar productos y novedades, descubrir tiendas de la comunidad y comunicarse mediante mensajes.',
          `${appName} no vende los productos ni presta los servicios publicados por las tiendas, y no interviene, procesa ni garantiza pagos, entregas, intercambios o acuerdos entre usuarios. Cada operación es responsabilidad exclusiva de las partes que la realizan.`,
        ],
      },
      {
        heading: '4. Contenido del usuario',
        paragraphs: [
          'El usuario es el único responsable del contenido que publica (textos, imágenes, datos de contacto, productos, novedades y mensajes) y declara tener derecho a publicarlo.',
          'Al publicar contenido, el usuario otorga a la App una licencia no exclusiva y gratuita para almacenarlo y mostrarlo dentro del servicio, con el único fin de prestarlo. Esta licencia termina cuando el contenido se elimina o la cuenta se cierra, salvo copias de seguridad temporales.',
        ],
      },
      {
        heading: '5. Conductas prohibidas',
        paragraphs: [
          'Está prohibido:',
          '• Publicar o enviar contenido ilegal, difamatorio, discriminatorio, violento, sexualmente explícito, que incite al odio o que exponga a menores.',
          '• Acosar, amenazar o intimidar a otros usuarios.',
          '• Ofrecer productos o servicios prohibidos por la ley, falsificados o que infrinjan derechos de terceros.',
          '• Realizar estafas o engaños, o suplantar la identidad de otra persona o negocio.',
          '• Enviar spam, publicidad masiva no solicitada o mensajes repetitivos.',
          '• Intentar acceder sin autorización a cuentas o sistemas, o interferir con el funcionamiento de la App.',
        ],
      },
      {
        heading: '6. Reportes, bloqueos y moderación',
        paragraphs: [
          'Los usuarios pueden reportar tiendas, perfiles y conversaciones, y bloquear a otros usuarios desde la App. Un usuario bloqueado no puede enviar mensajes a quien lo bloqueó.',
          `Los reportes son revisados por el equipo de ${appName}, que puede retirar contenido, restringir funciones, suspender o eliminar cuentas que incumplan estos términos, con o sin aviso previo según la gravedad. No se garantiza un plazo de revisión.`,
        ],
      },
      {
        heading: '7. Tiendas',
        paragraphs: [
          'Los titulares de tiendas son responsables de la exactitud de los precios, descripciones, disponibilidad, horarios y datos de contacto que publican, y del cumplimiento de las normas aplicables a su actividad, incluidas las de defensa del consumidor cuando correspondan.',
        ],
      },
      {
        heading: '8. Eliminación de la cuenta',
        paragraphs: [
          'El usuario puede eliminar su cuenta en cualquier momento desde Perfil > Eliminar cuenta. Esto elimina su perfil, su tienda, sus productos, sus favoritos, su historial y sus bloqueos, y no puede deshacerse.',
          'Las conversaciones se conservan para las demás personas que participaron de ellas, que verán a la cuenta eliminada como "Usuario eliminado", sin nombre ni foto. Los mensajes enviados siguen visibles en el historial de esas personas.',
        ],
      },
      {
        heading: '9. Disponibilidad y cambios del servicio',
        paragraphs: [
          `La App se ofrece "tal como está" y puede tener interrupciones, errores o cambios. ${appName} puede modificar, suspender o discontinuar funciones en cualquier momento.`,
        ],
      },
      {
        heading: '10. Limitación de responsabilidad',
        paragraphs: [
          `En la medida permitida por la ley, ${appName} no responde por los contenidos publicados por los usuarios, por las operaciones entre usuarios ni por daños indirectos derivados del uso o de la imposibilidad de uso de la App.`,
        ],
      },
      {
        heading: '11. Cambios en los términos',
        paragraphs: [
          'Estos términos pueden actualizarse. Cuando haya cambios relevantes, se pedirá al usuario aceptar la nueva versión para seguir usando la App.',
        ],
      },
      {
        heading: '12. Ley aplicable y contacto',
        paragraphs: [
          `Estos términos se rigen por las leyes de ${jurisdiction}.`,
          `Consultas: ${contactEmail}`,
        ],
      },
    ],
  };
};

export const getPrivacyDocument = (): LegalDocument => {
  const { appName, operatorName, minAge, jurisdiction, contactEmail, responseDays } = LEGAL;
  return {
    title: 'Política de Privacidad',
    sections: [
      {
        heading: '1. Responsable del tratamiento',
        paragraphs: [
          `${appName} es operada por ${operatorName}. Esta política explica qué datos se recopilan, para qué se usan y qué derechos tiene el usuario.`,
        ],
      },
      {
        heading: '2. Datos que recopilamos',
        paragraphs: [
          'Datos de cuenta: correo electrónico, nombre y apellido, foto de perfil (opcional) y contraseña. La contraseña la gestiona Firebase Authentication y la App no puede verla. Si el usuario ingresa con Google, se reciben su nombre, correo y foto de esa cuenta.',
          'Contenido que el usuario decide publicar: datos de su tienda (nombre, descripción, logo, banner, imágenes, productos, precios, horarios y novedades) y datos de contacto del negocio (teléfono, WhatsApp, dirección e Instagram).',
          'Mensajes enviados y recibidos entre usuarios.',
          'Actividad en la App: tiendas favoritas, tiendas visitadas recientemente, tema elegido, usuarios bloqueados y reportes enviados.',
          'La cámara se usa solo para escanear códigos QR: las imágenes de la cámara no se guardan ni se envían. El acceso a la galería se usa únicamente para elegir las imágenes que el usuario decide subir.',
          'La App no utiliza publicidad ni herramientas de analítica de terceros.',
        ],
      },
      {
        heading: '3. Para qué usamos los datos',
        paragraphs: [
          'Crear y administrar la cuenta, mostrar tiendas, novedades y comunidad, permitir la mensajería, garantizar la seguridad, prevenir abusos, revisar reportes y cumplir obligaciones legales.',
          'No vendemos datos personales ni los usamos para publicidad.',
        ],
      },
      {
        heading: '4. Con quién se comparten',
        paragraphs: [
          'Otros usuarios: el nombre y la foto de perfil se muestran en las conversaciones. Las tiendas públicas muestran su contenido y sus datos de contacto a cualquier usuario de la App.',
          `Proveedores que tratan datos por cuenta de ${appName}: Google Firebase (autenticación, base de datos y alojamiento web), Google Sign-In y Cloudinary (almacenamiento y entrega de imágenes). Cada uno se rige también por su propia política de privacidad.`,
          'Autoridades, cuando una norma o una resolución judicial lo exija.',
        ],
      },
      {
        heading: '5. Mensajes',
        paragraphs: [
          `Los mensajes solo son accesibles para quienes participan de la conversación. El equipo de ${appName} puede acceder al contenido de una conversación únicamente cuando sea necesario para revisar un reporte o cumplir una obligación legal.`,
          'Al eliminar una cuenta, los mensajes que envió permanecen en las conversaciones de las demás personas, como se explica en la sección 6.',
        ],
      },
      {
        heading: '6. Conservación y eliminación',
        paragraphs: [
          'Los datos se conservan mientras la cuenta esté activa. El usuario puede eliminar su cuenta desde Perfil > Eliminar cuenta, lo que borra su perfil, tienda, productos, favoritos, historial y bloqueos.',
          'Las conversaciones con otros usuarios se conservan en el historial de esos usuarios: el nombre y la foto de la cuenta eliminada se reemplazan por "Usuario eliminado", pero los mensajes enviados siguen siendo visibles para quienes participaron de la conversación.',
          'Las imágenes subidas están alojadas en Cloudinary y pueden permanecer allí un período adicional hasta su eliminación definitiva. Los reportes de moderación pueden conservarse el tiempo necesario para proteger a la comunidad.',
        ],
      },
      {
        heading: '7. Seguridad',
        paragraphs: [
          'Se aplican medidas razonables, como conexiones cifradas y reglas de acceso a la base de datos. Ningún sistema es completamente seguro.',
        ],
      },
      {
        heading: '8. Menores de edad',
        paragraphs: [
          `La App no está dirigida a menores de ${minAge} años y no recopila conscientemente sus datos. Si se detecta una cuenta de un menor, se eliminará.`,
        ],
      },
      {
        heading: '9. Derechos del usuario',
        paragraphs: [
          'El usuario puede acceder a sus datos, rectificarlos desde Perfil > Editar perfil, eliminarlos desde Perfil > Eliminar cuenta y oponerse a su tratamiento escribiendo a la dirección de contacto.',
          `Los pedidos se responden dentro de los ${responseDays} días, conforme a la legislación aplicable de ${jurisdiction}.`,
        ],
      },
      {
        heading: '10. Cambios en esta política',
        paragraphs: [
          'Esta política puede actualizarse. Cuando haya cambios relevantes se informará dentro de la App.',
        ],
      },
      {
        heading: '11. Contacto',
        paragraphs: [`Consultas y pedidos sobre datos personales: ${contactEmail}`],
      },
    ],
  };
};

export const getDataDeletionDocument = (): LegalDocument => {
  const { appName, contactEmail, responseDays } = LEGAL;
  return {
    title: 'Eliminar cuenta y datos',
    sections: [
      {
        heading: 'Desde la App',
        paragraphs: [
          '1. Iniciá sesión.',
          '2. Entrá a Perfil.',
          '3. Tocá "Eliminar cuenta".',
          '4. Ingresá tu contraseña y confirmá.',
        ],
      },
      {
        heading: 'Si no podés acceder a la App',
        paragraphs: [
          `Escribí a ${contactEmail} desde el correo asociado a tu cuenta, con el asunto "Eliminar cuenta". Confirmamos tu identidad y eliminamos tus datos dentro de los ${responseDays} días.`,
        ],
      },
      {
        heading: 'Qué se elimina',
        paragraphs: [
          'Tu perfil, tu tienda y sus productos, tus favoritos, tu historial de tiendas visitadas y tus bloqueos.',
        ],
      },
      {
        heading: 'Qué puede conservarse',
        paragraphs: [
          'Tus conversaciones con otras personas se conservan en el historial de ellas, con tu nombre y foto reemplazados por "Usuario eliminado". Los mensajes que enviaste siguen visibles para quienes participaron.',
          'Las imágenes subidas pueden permanecer un período adicional en el proveedor que las aloja hasta su eliminación definitiva. Los reportes de moderación pueden conservarse el tiempo necesario para proteger a la comunidad.',
          `Consultas: ${contactEmail} (${appName}).`,
        ],
      },
    ],
  };
};