import type { Metadata } from "next";
import LegalDoc, { A, B, LI, Note, P, UL, type LegalSection } from "@/components/legal/LegalDoc";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbs, pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Política de privacidad y tratamiento de datos",
  description:
    "Cómo Tu Embalaje recolecta, usa y protege tus datos personales según la Ley 1581 de 2012, y cómo ejercer tus derechos de habeas data.",
  path: "/politica-de-privacidad",
});

const contactEmail = <A href={`mailto:${SITE.email}`}>{SITE.email}</A>;

const sections: LegalSection[] = [
  {
    id: "responsable",
    title: "Responsable del tratamiento",
    content: (
      <>
        <P>
          El responsable del tratamiento de tus datos personales es <B>{SITE.legalName}</B>
          {SITE.nit && <>, identificada con NIT {SITE.nit}</>}
          {SITE.address ? <>, con domicilio en {SITE.address}</> : <>, con domicilio en {SITE.location}</>} (en adelante, “Tu
          Embalaje”, “nosotros”).
        </P>
        <UL>
          <LI>
            <B>Correo:</B> {contactEmail}
          </LI>
          <LI>
            <B>Teléfono / WhatsApp:</B> <A href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</A>
          </LI>
          <LI>
            <B>Sitio web:</B> <A href={SITE.url}>{SITE.url.replace(/^https?:\/\//, "")}</A>
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "marco-legal",
    title: "Marco legal",
    content: (
      <P>
        Esta política se rige por el artículo 15 de la Constitución Política de Colombia, la <B>Ley 1581 de 2012</B>{" "}
        (protección de datos personales), el <B>Decreto 1377 de 2013</B> (compilado en el Decreto 1074 de 2015) y demás
        normas que los modifiquen o complementen. Aplica a todos los datos personales que recolectamos a través de este
        sitio web y de nuestros canales de atención.
      </P>
    ),
  },
  {
    id: "datos",
    title: "Qué datos recolectamos",
    content: (
      <>
        <P>Solo pedimos los datos necesarios para atenderte. Según cómo uses el sitio:</P>
        <UL>
          <LI>
            <B>Formulario de cotización:</B> nombre, empresa (opcional), teléfono, correo, producto de interés y el
            mensaje que escribas. Este formulario <B>no guarda tus datos en nuestro sitio</B>: arma un mensaje y lo abre en
            WhatsApp para que tú decidas enviarlo.
          </LI>
          <LI>
            <B>Cuenta del foro:</B> nombre, correo electrónico y contraseña. La contraseña se guarda cifrada
            (nunca en texto plano) y nadie de nuestro equipo puede verla.
          </LI>
          <LI>
            <B>Publicaciones en el foro:</B> las preguntas, respuestas y “me gusta” que publiques, junto con la fecha. Tu
            nombre aparece públicamente junto a lo que publicas; tu correo <B>nunca</B> se muestra.
          </LI>
          <LI>
            <B>Comunicaciones directas:</B> los datos que nos compartas por WhatsApp, teléfono o correo al pedir una
            cotización o hacer un pedido.
          </LI>
          <LI>
            <B>Datos técnicos:</B> el servidor que aloja el sitio puede registrar de forma automática la dirección IP, el
            tipo de navegador y las páginas visitadas, con fines de seguridad y funcionamiento.
          </LI>
        </UL>
        <Note>
          No solicitamos datos sensibles (salud, origen étnico, orientación política o religiosa, datos biométricos, etc.)
          ni datos de menores de edad.
        </Note>
      </>
    ),
  },
  {
    id: "finalidades",
    title: "Para qué usamos tus datos",
    content: (
      <UL>
        <LI>Responder tus solicitudes, preparar cotizaciones y darte asesoría sobre nuestros productos.</LI>
        <LI>Gestionar pedidos, despachos, facturación y la relación comercial contigo o tu empresa.</LI>
        <LI>Crear y administrar tu cuenta del foro y mostrar tus publicaciones.</LI>
        <LI>Moderar el foro y prevenir spam, abusos o accesos no autorizados.</LI>
        <LI>Atender peticiones, quejas, reclamos y solicitudes de garantía.</LI>
        <LI>
          Enviarte información comercial sobre nuestros productos, <B>solo si nos lo autorizas</B>. Puedes pedir que dejemos
          de hacerlo en cualquier momento.
        </LI>
        <LI>Cumplir obligaciones legales, contables y tributarias.</LI>
      </UL>
    ),
  },
  {
    id: "autorizacion",
    title: "Autorización",
    content: (
      <P>
        Al crear una cuenta en el foro marcas una casilla con la que autorizas de forma previa, expresa e informada el
        tratamiento de tus datos según esta política. Cuando nos escribes por el formulario, WhatsApp, teléfono o correo,
        entendemos que nos autorizas a usar esos datos para responderte. Puedes revocar la autorización cuando quieras,
        salvo que exista un deber legal o contractual de conservarlos.
      </P>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <>
        <P>
          Usamos <B>una sola cookie</B>, llamada <code className="rounded bg-mist px-1.5 py-0.5 text-[13px]">te_session</code>,
          y solo si inicias sesión en el foro. Sirve para mantener tu sesión abierta, dura hasta 30 días y se borra al cerrar
          sesión. Es una cookie técnica, indispensable para el foro, y no se usa para publicidad ni para seguirte en otros
          sitios.
        </P>
        <P>
          No usamos cookies de analítica ni de publicidad. Si en el futuro las incorporamos, actualizaremos esta política y te
          pediremos tu consentimiento cuando la ley lo exija.
        </P>
      </>
    ),
  },
  {
    id: "terceros",
    title: "Con quién compartimos tus datos",
    content: (
      <>
        <P>
          <B>No vendemos ni alquilamos tus datos.</B> Solo los compartimos cuando es necesario para prestarte el servicio:
        </P>
        <UL>
          <LI>
            <B>WhatsApp (Meta Platforms):</B> cuando envías el formulario de cotización o nos escribes por WhatsApp, tu mensaje
            viaja por ese servicio y queda sujeto también a su propia política de privacidad.
          </LI>
          <LI>
            <B>Proveedor de alojamiento web:</B> almacena el sitio y la base de datos del foro, en calidad de encargado del
            tratamiento.
          </LI>
          <LI>
            <B>Transportadoras:</B> cuando haces un pedido, compartimos los datos de entrega necesarios para el despacho.
          </LI>
          <LI>
            <B>Autoridades:</B> cuando una ley o una orden judicial o administrativa así lo exija.
          </LI>
        </UL>
        <P>
          Algunos de estos proveedores pueden tener servidores fuera de Colombia. En esos casos exigimos que ofrezcan niveles
          adecuados de protección, según lo previsto en la Ley 1581 de 2012.
        </P>
      </>
    ),
  },
  {
    id: "derechos",
    title: "Tus derechos",
    content: (
      <>
        <P>Como titular de los datos tienes derecho a:</P>
        <UL>
          <LI>Conocer, actualizar y rectificar tus datos personales.</LI>
          <LI>Pedir prueba de la autorización que nos diste.</LI>
          <LI>Ser informado sobre el uso que les hemos dado.</LI>
          <LI>
            Revocar la autorización y pedir que eliminemos tus datos, cuando no exista un deber legal o contractual de
            conservarlos.
          </LI>
          <LI>Acceder gratuitamente a tus datos.</LI>
          <LI>
            Presentar quejas ante la <B>Superintendencia de Industria y Comercio (SIC)</B> después de haber agotado el trámite
            de consulta o reclamo con nosotros.
          </LI>
        </UL>
      </>
    ),
  },
  {
    id: "como-ejercerlos",
    title: "Cómo ejercer tus derechos",
    content: (
      <>
        <P>
          Escríbenos a {contactEmail} con el asunto “Datos personales”, indicando tu nombre, tu solicitud y un medio de
          contacto. Para proteger tu información, podemos pedirte que confirmes tu identidad.
        </P>
        <UL>
          <LI>
            <B>Consultas</B> (qué datos tenemos y cómo los usamos): respondemos en máximo <B>10 días hábiles</B>, prorrogables
            por 5 días hábiles más si es necesario, avisándote el motivo.
          </LI>
          <LI>
            <B>Reclamos</B> (corrección, actualización, supresión o revocatoria): respondemos en máximo{" "}
            <B>15 días hábiles</B>, prorrogables por 8 días hábiles más, avisándote el motivo.
          </LI>
        </UL>
        <Note>
          Si quieres eliminar tu cuenta del foro, escríbenos desde el correo con el que te registraste. Borraremos la cuenta y
          tus datos de acceso; tus publicaciones se eliminarán o se dejarán sin tu nombre, según prefieras.
        </Note>
      </>
    ),
  },
  {
    id: "seguridad",
    title: "Seguridad",
    content: (
      <P>
        Aplicamos medidas técnicas y administrativas razonables para proteger tus datos: conexión cifrada (HTTPS),
        contraseñas guardadas con cifrado irreversible, cookie de sesión protegida contra accesos desde otros sitios y acceso
        restringido a la información. Ningún sistema es 100 % infalible, pero si ocurriera un incidente que afecte tus datos te
        lo informaríamos y lo reportaríamos a la autoridad cuando corresponda.
      </P>
    ),
  },
  {
    id: "conservacion",
    title: "Cuánto tiempo guardamos tus datos",
    content: (
      <UL>
        <LI>
          <B>Cuenta y publicaciones del foro:</B> mientras tu cuenta esté activa o hasta que pidas eliminarla.
        </LI>
        <LI>
          <B>Datos de clientes y pedidos:</B> durante la relación comercial y el tiempo que exijan las normas contables y
          tributarias.
        </LI>
        <LI>
          <B>Solicitudes y cotizaciones:</B> el tiempo necesario para atenderlas y hacerles seguimiento.
        </LI>
      </UL>
    ),
  },
  {
    id: "menores",
    title: "Menores de edad",
    content: (
      <P>
        Nuestro sitio está dirigido a empresas y personas mayores de edad. No recolectamos a sabiendas datos de menores de 18
        años. Si crees que un menor nos ha dado sus datos, escríbenos y los eliminaremos.
      </P>
    ),
  },
  {
    id: "cambios",
    title: "Cambios a esta política",
    content: (
      <P>
        Podemos actualizar esta política para reflejar cambios legales o en nuestros servicios. Publicaremos la nueva versión
        en esta página con su fecha de actualización y, si el cambio es importante, lo avisaremos en el sitio. Esta versión
        rige desde el {SITE.legalUpdated}.
      </P>
    ),
  },
];

export default function PoliticaPrivacidadPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Inicio", path: "/" },
          { name: "Política de privacidad", path: "/politica-de-privacidad" },
        ])}
      />
      <Navbar solid />
      <main>
        <LegalDoc
          kind="Documento legal"
          title="Política de privacidad y tratamiento de datos"
          intro="Te contamos de forma clara qué datos recolectamos, para qué los usamos, con quién los compartimos y cómo puedes ejercer tus derechos."
          sections={sections}
          related={{ label: "Términos y condiciones", href: "/terminos-y-condiciones" }}
        />
      </main>
      <Footer />
    </>
  );
}
