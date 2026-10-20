import {
  CircleHelp,
  FileText,
  History,
  Image as ImageIcon,
  Lock,
  Package,
  PenLine,
  Rocket,
  Search,
  Settings,
  Type,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { C, Go, H, List, P, Steps, Table, Tip } from "./ui";

export type Article = {
  id: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  /** Palabras extra para el buscador. */
  keywords: string;
  body: ReactNode;
};

export const ARTICLES: Article[] = [
  {
    id: "inicio",
    title: "Primeros pasos",
    summary: "Qué es el panel, cómo entrar y cómo está organizado.",
    icon: Rocket,
    keywords: "entrar login ingresar menú escritorio publicar",
    body: (
      <>
        <P>
          El panel es la «oficina» de tu web: desde aquí cambias textos, fotos, productos y cómo apareces en Google, sin tocar código. Todo
          lo que guardas queda en la base de datos y se ve en la web <b>al instante</b>.
        </P>
        <H>Cómo entrar</H>
        <Steps
          items={[
            <>
              Abre <C>tuembalaje.com/admin/login</C> en el navegador.
            </>,
            "Escribe tu correo y tu contraseña de administrador.",
            <>
              Para salir, usa <b>Cerrar sesión</b> (arriba a la derecha). Si no cierras sesión, sigue abierta hasta 30 días en ese equipo.
            </>,
          ]}
        />
        <H>El menú</H>
        <Table
          head={["Opción", "Para qué sirve"]}
          rows={[
            ["Escritorio", "Resumen: accesos rápidos y últimos cambios."],
            ["Páginas", "Textos e imágenes de Inicio, Nosotros, Productos, Contacto, Cotizador y documentos legales."],
            ["Productos", "El catálogo: crear, ordenar, destacar y editar la ficha técnica de cada producto."],
            ["Medios", "Biblioteca de imágenes: subir fotos y ver dónde se usan."],
            ["SEO · Google", "Cómo aparece cada página en Google y al compartir el enlace."],
            ["Ajustes generales", "WhatsApp, teléfonos, correos, redes, datos legales y pie de página."],
            ["Historial", "Todas las versiones guardadas. Desde aquí se deshace cualquier cambio."],
            ["Mi cuenta", "Cambiar tu contraseña."],
          ]}
        />
        <Tip>
          En cada pantalla encuentras el botón <b>¿Cómo funciona?</b>, que te trae directo a la parte de esta guía que la explica.
        </Tip>
      </>
    ),
  },
  {
    id: "paginas",
    title: "Páginas: qué se edita en cada una",
    summary: "Dónde está cada texto de la web.",
    icon: FileText,
    keywords: "inicio nosotros contacto cotizador privacidad términos legal secciones",
    body: (
      <>
        <P>
          Cada página de la web está dividida en <b>secciones</b>, en el mismo orden en que aparecen al recorrerla de arriba hacia abajo.
        </P>
        <Table
          head={["Página", "Qué contiene"]}
          rows={[
            ["Inicio", "Encabezado principal, cifras, sobre nosotros, productos destacados, proceso, compromiso, sectores, testimonios y franja final."],
            ["Nosotros", "Encabezado, misión, visión y valores. (La parte «Sobre nosotros», el proceso y los testimonios se comparten con Inicio.)"],
            ["Productos (página)", "Solo el encabezado. Los productos se editan en el menú Productos."],
            ["Contacto", "Encabezado, formulario y tarjetas. Los teléfonos y correos están en Ajustes generales."],
            ["Cotizador", "Textos, medidas estándar, precios de referencia y mensajes de resultado."],
            ["Política de privacidad / Términos", "Documentos legales completos, sección por sección."],
          ]}
        />
        <Tip>
          ¿No encuentras un texto? Los datos de contacto viven en <Go href="/admin/ajustes">Ajustes generales</Go> y los títulos que salen en
          Google en <Go href="/admin/seo">SEO</Go>.
        </Tip>
      </>
    ),
  },
  {
    id: "editar",
    title: "Cómo editar y publicar una sección",
    summary: "Pestañas, bloques, publicar, descartar y volver al original.",
    icon: PenLine,
    keywords: "guardar publicar descartar restablecer original sin guardar punto verde ámbar",
    body: (
      <>
        <Steps
          items={[
            <>
              Entra a <Go href="/admin/paginas">Páginas</Go> y elige la página.
            </>,
            "A la izquierda (arriba en celular) está el índice de secciones. Haz clic en la que quieras editar: se abre solo esa.",
            "Los campos están ordenados en bloques (Textos, Botones, Imagen…). Cambia lo que necesites.",
            <>
              Pulsa <b>Publicar cambios</b>. La web se actualiza en ese momento y la versión anterior queda guardada en el Historial.
            </>,
          ]}
        />
        <H>Los puntos de colores del índice</H>
        <List
          items={[
            <>
              <b className="text-brand-dark">Verde</b>: la sección ya fue editada.
            </>,
            <>
              <b className="text-amber-600">Ámbar</b>: tienes cambios <b>sin guardar</b> en esa sección.
            </>,
            <>
              <b className="text-ink/50">Gris</b>: conserva los textos originales de la web.
            </>,
          ]}
        />
        <H>Otros botones</H>
        <List
          items={[
            <>
              <b>Descartar</b>: borra lo que escribiste y vuelve a lo último publicado.
            </>,
            <>
              <b>Restablecer original</b>: vuelve la sección a los textos con los que se creó la web. Tu versión queda en el Historial por si la
              necesitas.
            </>,
            <>
              <b>Ver en el sitio</b>: abre la página pública en otra pestaña para revisar el resultado.
            </>,
          ]}
        />
        <Tip warn>Cada sección se publica por separado. Si cambias dos secciones, publica cada una antes de salir de la página.</Tip>
        <H>Listas (características, pasos, testimonios…)</H>
        <List
          items={[
            "Haz clic en un elemento para abrirlo o cerrarlo.",
            "Las flechas ↑ ↓ cambian el orden y la papelera lo elimina.",
            <>
              <b>Agregar…</b> crea uno nuevo al final. Algunas listas tienen un mínimo y un máximo de elementos para que el diseño se vea bien.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: "textos",
    title: "Formato de los textos",
    summary: "Resaltar en verde, saltos de línea y formato de los documentos legales.",
    icon: Type,
    keywords: "asteriscos verde resaltado negrita salto de línea enter viñetas enlace variables",
    body: (
      <>
        <Table
          head={["Escribes", "Se ve así"]}
          rows={[
            [
              <C key="a">Hablemos de tu *embalaje*</C>,
              <>
                Hablemos de tu <span className="font-bold text-brand">embalaje</span> (en los títulos que lo indican)
              </>,
            ],
            ["Enter (nueva línea)", "Salto de línea en el mismo lugar"],
          ]}
        />
        <H>Documentos legales</H>
        <P>El contenido de la política de privacidad y de los términos admite un formato un poco más completo:</P>
        <Table
          head={["Escribes", "Resultado"]}
          rows={[
            ["Una línea en blanco", "Nuevo párrafo"],
            [<C key="b">- texto</C>, "Viñeta"],
            [<C key="c">&gt; texto</C>, "Recuadro destacado"],
            [<C key="d">**texto**</C>, <b key="e">Negrita</b>],
            [<C key="f">[texto](https://…)</C>, "Enlace"],
          ]}
        />
        <P>
          También puedes usar variables, que se reemplazan solas con los datos de Ajustes generales: <C>{"{empresa}"}</C>, <C>{"{nit_texto}"}</C>,{" "}
          <C>{"{domicilio}"}</C>, <C>{"{correo}"}</C>, <C>{"{telefono}"}</C>, <C>{"{sitio}"}</C>, <C>{"{horario}"}</C> y <C>{"{fecha}"}</C>.
        </P>
        <Tip>Así, si cambias tu correo o teléfono en Ajustes generales, los documentos legales se actualizan solos.</Tip>
      </>
    ),
  },
  {
    id: "imagenes",
    title: "Imágenes y medios",
    summary: "Subir fotos, tamaños recomendados y descripción para Google.",
    icon: ImageIcon,
    keywords: "foto subir cambiar imagen tamaño peso webp jpg png medios biblioteca alt descripción",
    body: (
      <>
        <Steps
          items={[
            <>
              En cualquier campo de imagen pulsa <b>Cambiar imagen</b>.
            </>,
            "Elige una de la biblioteca o arrastra una foto nueva desde tu computador o celular.",
            "Publica la sección para que se vea en la web.",
          ]}
        />
        <P>
          Las fotos se optimizan solas: se convierten a formato WebP y se reducen a máximo 2400 px, para que la web siga siendo rápida. Se
          aceptan JPG, PNG y WebP de hasta 15 MB.
        </P>
        <Table
          head={["Uso", "Tamaño recomendado"]}
          rows={[
            ["Fondos de secciones (encabezado, franjas)", "1920 × 1080 px, horizontal"],
            ["Fotos de productos", "1200 × 900 px (4:3)"],
            ["Imagen al compartir (SEO)", "1200 × 630 px"],
          ]}
        />
        <H>La biblioteca (Medios)</H>
        <List
          items={[
            "Muestra todas las imágenes: las que subes y las que ya trae la web, y en cada una, dónde se usa (con enlace para editarla).",
            <>
              <b>Reemplazar</b>: cambia la imagen por otra (subida en ese momento o de la biblioteca) en <b>todos</b> los lugares donde se usa.
              Queda en el Historial, así que se puede deshacer.
            </>,
            <>
              <b>Eliminar</b>: las subidas se borran; las que trae la web se ocultan de la biblioteca (filtro «Ocultas», desde donde se
              restauran). Una imagen en uso no se puede quitar: primero reemplázala.
            </>,
            <>
              Puedes escribir una <b>descripción</b> de cada imagen subida: la leen Google y las personas con lectores de pantalla.
            </>,
          ]}
        />
        <Tip>Usa fotos reales de tus productos y tu planta: generan más confianza que las fotos de catálogo.</Tip>
      </>
    ),
  },
  {
    id: "productos",
    title: "Productos y ficha técnica",
    summary: "Crear, ordenar, destacar y completar la ficha técnica.",
    icon: Package,
    keywords: "producto catálogo ficha técnica destacado ordenar duplicar eliminar etiquetas categoría",
    body: (
      <>
        <List
          items={[
            <>
              <b>Nuevo producto</b>: botón verde arriba a la derecha en <Go href="/admin/productos">Productos</Go>.
            </>,
            <>
              <b>Orden</b>: las flechas ↑ ↓ de la lista. Es el mismo orden del catálogo de la web.
            </>,
            <>
              <b>Destacado</b>: los productos marcados aparecen en Inicio y en el pie de página.
            </>,
            <>
              <b>Duplicar</b>: crea una copia para hacer un producto parecido más rápido.
            </>,
            <>
              <b>Eliminar</b>: pide confirmación y se puede recuperar desde el Historial.
            </>,
          ]}
        />
        <H>La ficha técnica</H>
        <P>
          Cada dato (Nombre + Valor) se muestra en la ventana «Ficha técnica» del catálogo. Los nombres Medidas, Madera, Tratamiento,
          Ensamble o Entradas de montacargas llevan su propio ícono.
        </P>
        <H>Etiquetas e identificador</H>
        <List
          items={[
            <>
              <b>Etiquetas</b> (separadas por comas): ayudan al buscador del catálogo. Ej: <C>NIMF 15, Exportación</C>.
            </>,
            <>
              <b>Identificador en la URL</b>: el nombre corto que va en el enlace (<C>/productos#cajas-madera</C>). Si lo cambias, los enlaces
              viejos dejan de llevar directo al producto.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: "seo",
    title: "SEO: aparecer en Google",
    summary: "Palabra clave, título, descripción, puntaje y Google Search Console.",
    icon: Search,
    keywords: "seo google buscador posicionamiento título descripción meta palabra clave puntaje search console verificación compartir whatsapp redes sitemap",
    body: (
      <>
        <P>
          SEO es lo que ayuda a que Google entienda tu web y la muestre cuando alguien busca lo que vendes. En{" "}
          <Go href="/admin/seo">SEO · Google</Go> defines, para cada página, cómo se ve en los resultados de Google y al compartir el enlace
          en WhatsApp, Facebook o LinkedIn.
        </P>
        <H>Los campos de cada página</H>
        <Table
          head={["Campo", "Qué es", "Consejo"]}
          rows={[
            ["Palabra clave", "La frase que la gente busca y por la que quieres aparecer.", "Una por página, la más importante. Ej: «cajas de madera»."],
            ["Título para Google", "El texto azul y grande del resultado; también el nombre de la pestaña.", "30–60 caracteres. Pon la palabra clave al inicio."],
            ["Meta descripción", "El texto gris bajo el título.", "120–160 caracteres. Explica el beneficio e invita a hacer clic."],
            ["Imagen al compartir", "La foto de la vista previa en WhatsApp y redes.", "1200 × 630 px. Si la dejas vacía se usa la imagen general."],
            ["Ocultar de Google", "Pide a los buscadores no mostrar la página.", "Déjalo apagado salvo casos especiales."],
          ]}
        />
        <H>El puntaje</H>
        <P>
          A la derecha de cada página ves la vista previa en Google y en redes, y una revisión con puntos verdes (bien), ámbar (mejorable) y
          rojos (revisar). El puntaje se actualiza mientras escribes; apunta a 80 o más.
        </P>
        <Tip>
          El puntaje es una guía, no una garantía: Google también mira la velocidad de la web, los enlaces que llegan a ella y qué tan útil es el
          contenido. Escribe pensando en tus clientes, no solo en el puntaje.
        </Tip>
        <H>Ajustes globales</H>
        <List
          items={[
            <>
              <b>Final de marca</b>: el texto que se agrega al final de cada título (por defecto <C>| Tu Embalaje</C>).
            </>,
            <>
              <b>Palabras clave del sitio</b>: describen tu web en general.
            </>,
            <>
              <b>Imagen general al compartir</b>: la que usan las páginas sin imagen propia. Vacía = la imagen de marca automática.
            </>,
          ]}
        />
        <H>Conectar Google Search Console (recomendado)</H>
        <Steps
          items={[
            <>
              Entra a{" "}
              <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-dark underline">
                Google Search Console
              </a>{" "}
              con tu cuenta de Google y agrega la propiedad <b>Prefijo de la URL</b> con <C>https://tuembalaje.com</C>.
            </>,
            <>
              Elige el método <b>Etiqueta HTML</b>. Google te muestra algo como <C>{'<meta name="google-site-verification" content="abc123…" />'}</C>.
            </>,
            <>
              Copia solo lo que está dentro de <C>content=&quot;…&quot;</C> y pégalo en <b>Código de Google Search Console</b> (Ajustes globales de
              SEO). Publica.
            </>,
            <>
              Vuelve a Google y pulsa <b>Verificar</b>. Luego, en «Sitemaps», envía <C>sitemap.xml</C>.
            </>,
          ]}
        />
        <P>Desde ahí verás con qué búsquedas te encuentran, cuántos clics recibes y si Google detecta algún problema.</P>
        <Tip warn>
          Los cambios de SEO se publican al instante en la web, pero Google tarda desde unos días hasta algunas semanas en volver a leer la página y
          actualizar sus resultados.
        </Tip>
      </>
    ),
  },
  {
    id: "ajustes",
    title: "Ajustes generales",
    summary: "WhatsApp, teléfonos, correos, redes, datos legales y pie de página.",
    icon: Settings,
    keywords: "whatsapp teléfono correo instagram horario ubicación nit razón social pie de página",
    body: (
      <>
        <P>Los datos de esta pantalla se usan en toda la web a la vez: botones de WhatsApp, página de contacto, pie de página y documentos legales.</P>
        <List
          items={[
            <>
              <b>WhatsApp de ventas</b>: solo números, con el indicativo del país y sin espacios ni «+». Ej: <C>573225982715</C>. Todos los
              botones de WhatsApp usan este número.
            </>,
            <>
              <b>Teléfonos y correos</b>: el primero de cada lista es el principal.
            </>,
            <>
              <b>Datos legales</b>: razón social, NIT y dirección para la política de privacidad y los términos.
            </>,
            <>
              <b>Pie de página</b>: la descripción y el lema que se ven al final de todas las páginas.
            </>,
          ]}
        />
        <Tip warn>Después de cambiar el WhatsApp, abre la web y prueba un botón para confirmar que abre el chat correcto.</Tip>
      </>
    ),
  },
  {
    id: "historial",
    title: "Historial y deshacer cambios",
    summary: "Recuperar cualquier versión anterior.",
    icon: History,
    keywords: "deshacer recuperar restaurar versión anterior error borré",
    body: (
      <>
        <P>Cada vez que publicas, eliminas un producto o restableces una sección, se guarda una versión con la fecha y la persona que lo hizo.</P>
        <Steps
          items={[
            <>
              Entra a <Go href="/admin/historial">Historial</Go>.
            </>,
            "Busca el cambio por su nombre y fecha.",
            <>
              Pulsa <b>Restaurar</b>: esa versión vuelve a publicarse (y la actual queda también en el historial).
            </>,
          ]}
        />
        <Tip>Así que puedes probar con tranquilidad: cualquier error se deshace en dos clics.</Tip>
      </>
    ),
  },
  {
    id: "usuarios",
    title: "Usuarios y permisos",
    summary: "Crear cuentas, roles, suspender, cambiar contraseñas y eliminar.",
    icon: Users,
    keywords: "usuario usuarios crear nuevo administrador miembro foro rol permiso suspender bloquear eliminar contraseña olvidó equipo",
    body: (
      <>
        <P>
          En <Go href="/admin/usuarios">Usuarios</Go> ves todas las cuentas: las de tu equipo (administradores) y las de las personas que se
          registraron en el foro. Puedes buscar por nombre, correo o teléfono y filtrar por tipo.
        </P>
        <H>Los dos roles</H>
        <Table
          head={["Rol", "Qué puede hacer"]}
          rows={[
            ["Administrador", "Entrar a este panel y editar todo: páginas, productos, SEO, ajustes y usuarios. En el foro puede moderar, y sus respuestas llevan la insignia «Equipo Tu Embalaje»."],
            ["Miembro del foro", "Preguntar, responder y dar «me gusta» en el foro. No puede entrar al panel."],
          ]}
        />
        <H>Crear un usuario</H>
        <Steps
          items={[
            <>
              Pulsa <b>Nuevo usuario</b>.
            </>,
            "Escribe nombre y correo (y si quieres, teléfono y cargo) y elige el rol.",
            <>
              Elige <b>Generar una segura</b> para que el sistema cree la contraseña, o escríbela tú.
            </>,
            <>
              Si se generó, <b>cópiala en ese momento</b>: solo se muestra una vez. Entrégasela a la persona por un medio seguro.
            </>,
          ]}
        />
        <H>Administrar una cuenta</H>
        <List
          items={[
            <>
              <b>Editar datos o rol</b>: abre el usuario, cambia lo que necesites y pulsa «Guardar cambios».
            </>,
            <>
              <b>Olvidó su contraseña</b>: en su ficha, «Asignar nueva contraseña». Sus sesiones abiertas se cierran.
            </>,
            <>
              <b>Suspender</b>: le quita el acceso (panel y foro) sin borrar nada. Se reactiva apagando el interruptor.
            </>,
            <>
              <b>Eliminar</b>: borra la cuenta y sus publicaciones del foro, y no se puede deshacer. Prefiere suspender.
            </>,
          ]}
        />
        <Tip>
          Por seguridad, nadie puede quitarse a sí mismo el rol de administrador ni suspender su propia cuenta, y el panel nunca puede quedar sin
          al menos un administrador activo.
        </Tip>
      </>
    ),
  },
  {
    id: "cuenta",
    title: "Mi cuenta y seguridad",
    summary: "Tus datos, tu contraseña y tus sesiones abiertas.",
    icon: UserCog,
    keywords: "contraseña clave seguridad cerrar sesión cuenta perfil datos nombre correo dispositivos",
    body: (
      <>
        <List
          items={[
            <>
              En <Go href="/admin/cuenta">Mi cuenta</Go> actualizas tu nombre, correo, teléfono y cargo. Si cambias el correo, desde ese momento
              inicias sesión con el nuevo.
            </>,
            "Para cambiar la contraseña necesitas la actual. El medidor te indica qué tan segura es la nueva (mínimo 10 caracteres).",
            <>
              <b>Cerrar las demás sesiones</b> desconecta tu cuenta de todos los demás dispositivos. Úsalo si entraste desde un computador ajeno o
              perdiste el celular.
            </>,
            "Tras varios intentos fallidos, el ingreso se bloquea unos minutos para proteger la cuenta.",
          ]}
        />
      </>
    ),
  },
  {
    id: "portal",
    title: "Portal de clientes",
    summary: "Opción del menú de la web que todavía no está activa.",
    icon: Lock,
    keywords: "portal clientes próximamente bloqueado",
    body: (
      <P>
        En el menú de la web aparece «Portal de Clientes» con un candado y la etiqueta «Próximamente». Es un espacio reservado: aún no hace nada y
        se activará cuando lo desarrollemos.
      </P>
    ),
  },
  {
    id: "preguntas",
    title: "Preguntas frecuentes",
    summary: "Soluciones rápidas a dudas comunes.",
    icon: CircleHelp,
    keywords: "problema no se ve no aparece error ayuda celular",
    body: (
      <div className="space-y-4">
        {[
          [
            "Publiqué pero no veo el cambio en la web.",
            "Recarga la página pública (Ctrl + F5 en computador). Revisa también que hayas publicado la sección correcta: si su punto en el índice está ámbar, aún no se guardó.",
          ],
          ["¿Puedo editar desde el celular?", "Sí. El panel se adapta al celular; el menú se abre con el botón ☰ de arriba a la izquierda."],
          ["Me equivoqué y publiqué algo mal.", "Ve al Historial y restaura la versión anterior. También puedes usar «Restablecer original» en la sección."],
          ["Mi foto no sube.", "Revisa que sea JPG, PNG o WebP y que pese menos de 15 MB."],
          ["¿Por qué mi página no aparece primero en Google?", "El SEO toma tiempo y depende también de otros factores. Mantén el puntaje en verde, conecta Search Console y publica contenido útil (por ejemplo, respuestas en el foro)."],
        ].map(([q, a]) => (
          <div key={q} className="rounded-2xl bg-mist/60 p-4">
            <p className="text-[14px] font-bold text-forest-dark">{q}</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink/70">{a}</p>
          </div>
        ))}
      </div>
    ),
  },
];

