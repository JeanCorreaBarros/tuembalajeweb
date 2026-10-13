import type { Metadata } from "next";
import LegalDoc, { A, B, LI, Note, P, UL, type LegalSection } from "@/components/legal/LegalDoc";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbs, pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Términos y condiciones de uso",
  description:
    "Condiciones para usar el sitio web de Tu Embalaje: cotizaciones, pedidos, uso del foro, propiedad intelectual y responsabilidad.",
  path: "/terminos-y-condiciones",
});

const contactEmail = <A href={`mailto:${SITE.email}`}>{SITE.email}</A>;

const sections: LegalSection[] = [
  {
    id: "aceptacion",
    title: "Aceptación",
    content: (
      <>
        <P>
          Estos términos regulan el uso del sitio web {SITE.url.replace(/^https?:\/\//, "")} (el “sitio”), operado por{" "}
          <B>{SITE.legalName}</B>
          {SITE.nit && <>, NIT {SITE.nit}</>}. Al navegar el sitio, solicitar una cotización o crear una cuenta en el foro,
          aceptas estos términos y nuestra <A href="/politica-de-privacidad">Política de privacidad</A>.
        </P>
        <P>Si no estás de acuerdo con ellos, te pedimos no usar el sitio.</P>
      </>
    ),
  },
  {
    id: "servicios",
    title: "Qué ofrecemos",
    content: (
      <P>
        Tu Embalaje diseña y fabrica embalajes en madera: cajas, estibas y pallets, huacales, embalajes especiales y piezas a
        la medida. El sitio es un canal informativo y de contacto: muestra nuestros productos, permite pedir asesoría y
        cotizaciones, y ofrece un foro de preguntas y respuestas. <B>En el sitio no se realizan compras ni pagos en línea.</B>
      </P>
    ),
  },
  {
    id: "cotizaciones",
    title: "Información de productos, cotizaciones y pedidos",
    content: (
      <>
        <UL>
          <LI>
            Las descripciones, fotografías y medidas del sitio son <B>referenciales</B>. Cada embalaje se fabrica según tu
            necesidad, por lo que el producto final puede variar en tipo de madera, acabado, color o dimensiones.
          </LI>
          <LI>
            Enviar el formulario o escribirnos por WhatsApp es una <B>solicitud de información</B>, no un pedido. Los precios,
            especificaciones, cantidades, tiempos de entrega y condiciones de pago se definen en la{" "}
            <B>cotización escrita</B> que te enviamos, con su vigencia.
          </LI>
          <LI>
            Un pedido queda confirmado cuando aceptas la cotización y se cumplen las condiciones acordadas en ella (por
            ejemplo, anticipo u orden de compra).
          </LI>
          <LI>
            La certificación <B>NIMF 15</B> aplica a los productos cotizados expresamente con ese tratamiento y se acredita
            con el sello correspondiente.
          </LI>
          <LI>
            Los tiempos de entrega son estimados y pueden verse afectados por causas ajenas a nosotros (disponibilidad de
            materia prima, transporte, clima, orden público). Te avisaremos oportunamente de cualquier cambio.
          </LI>
        </UL>
        <Note>
          Las garantías, cambios y reclamaciones sobre productos se rigen por lo pactado en la cotización y por el Estatuto del
          Consumidor (<B>Ley 1480 de 2011</B>) cuando sea aplicable.
        </Note>
      </>
    ),
  },
  {
    id: "uso",
    title: "Uso adecuado del sitio",
    content: (
      <>
        <P>Al usar el sitio te comprometes a no:</P>
        <UL>
          <LI>Suministrar información falsa o de otra persona.</LI>
          <LI>Intentar acceder sin autorización a cuentas, sistemas o datos de otros usuarios o del sitio.</LI>
          <LI>Enviar virus, código malicioso o realizar acciones que afecten el funcionamiento del sitio.</LI>
          <LI>Usar robots o procesos automáticos para extraer información de forma masiva.</LI>
          <LI>Usar el sitio para fines ilegales o contrarios a estos términos.</LI>
        </UL>
      </>
    ),
  },
  {
    id: "foro",
    title: "Cuentas y foro de la comunidad",
    content: (
      <>
        <UL>
          <LI>
            Para preguntar o responder necesitas una cuenta. Eres responsable de mantener tu contraseña en secreto y de la
            actividad que se haga con tu cuenta.
          </LI>
          <LI>
            Tu <B>nombre</B> y lo que publicas son <B>visibles para cualquier visitante</B> y pueden aparecer en buscadores como
            Google. No publiques datos personales tuyos o de terceros (teléfonos, direcciones, documentos).
          </LI>
          <LI>
            No se permite publicar contenido ofensivo, discriminatorio, ilegal, engañoso, spam, publicidad no autorizada ni
            material que infrinja derechos de terceros.
          </LI>
          <LI>
            Podemos editar, ocultar o eliminar publicaciones, y suspender o cerrar cuentas que incumplan estas reglas, sin
            previo aviso.
          </LI>
          <LI>
            Conservas los derechos sobre lo que publicas, y nos autorizas de forma gratuita y no exclusiva a mostrarlo en el
            sitio mientras esté publicado.
          </LI>
        </UL>
        <Note>
          Las respuestas del foro, incluidas las de nuestro equipo, son <B>orientativas</B>. No reemplazan un estudio técnico
          ni una cotización formal: para tu caso concreto (cargas, medidas, normas del país de destino) solicita asesoría
          directa.
        </Note>
      </>
    ),
  },
  {
    id: "propiedad",
    title: "Propiedad intelectual",
    content: (
      <P>
        La marca <B>Tu Embalaje</B>, el logotipo, los textos, fotografías, diseños, gráficos y el código del sitio pertenecen a{" "}
        {SITE.legalName} o se usan con autorización, y están protegidos por las normas de propiedad intelectual. No puedes
        copiarlos, modificarlos ni usarlos con fines comerciales sin nuestra autorización previa y por escrito. Puedes
        compartir enlaces a nuestras páginas libremente.
      </P>
    ),
  },
  {
    id: "enlaces",
    title: "Enlaces a otros sitios",
    content: (
      <P>
        El sitio incluye enlaces a servicios de terceros, como WhatsApp e Instagram. No controlamos esos sitios ni somos
        responsables de su contenido o de sus políticas de privacidad; te recomendamos revisarlas al usarlos.
      </P>
    ),
  },
  {
    id: "responsabilidad",
    title: "Responsabilidad",
    content: (
      <>
        <P>
          Hacemos lo posible para que el sitio funcione de forma continua y que su información sea correcta y esté
          actualizada, pero puede tener interrupciones, errores o información desactualizada. En la medida en que la ley lo
          permita, no respondemos por:
        </P>
        <UL>
          <LI>Daños derivados de interrupciones o fallas técnicas del sitio o de servicios de terceros.</LI>
          <LI>Decisiones tomadas solo con base en la información general del sitio o del foro.</LI>
          <LI>El contenido publicado por otros usuarios en el foro.</LI>
        </UL>
        <P>Nada de lo anterior limita los derechos que te reconoce el Estatuto del Consumidor cuando sea aplicable.</P>
      </>
    ),
  },
  {
    id: "datos",
    title: "Protección de datos personales",
    content: (
      <P>
        El tratamiento de tus datos se rige por nuestra <A href="/politica-de-privacidad">Política de privacidad y
        tratamiento de datos</A>, conforme a la Ley 1581 de 2012.
      </P>
    ),
  },
  {
    id: "cambios",
    title: "Cambios a estos términos",
    content: (
      <P>
        Podemos modificar estos términos en cualquier momento. La versión vigente es la publicada en esta página, con su
        fecha de actualización. Si sigues usando el sitio después de un cambio, entendemos que aceptas la nueva versión.
      </P>
    ),
  },
  {
    id: "ley",
    title: "Ley aplicable",
    content: (
      <P>
        Estos términos se rigen por las leyes de la <B>República de Colombia</B>. Cualquier diferencia se intentará resolver
        primero de forma directa y amistosa; si no es posible, se acudirá a las autoridades competentes en Colombia.
      </P>
    ),
  },
  {
    id: "contacto",
    title: "Contacto",
    content: (
      <P>
        Si tienes preguntas sobre estos términos, escríbenos a {contactEmail} o llámanos al{" "}
        <A href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</A> ({SITE.schedule}).
      </P>
    ),
  },
];

export default function TerminosPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Inicio", path: "/" },
          { name: "Términos y condiciones", path: "/terminos-y-condiciones" },
        ])}
      />
      <Navbar solid />
      <main>
        <LegalDoc
          kind="Documento legal"
          title="Términos y condiciones de uso"
          intro="Las reglas para usar nuestro sitio web, pedir cotizaciones y participar en el foro de la comunidad."
          sections={sections}
          related={{ label: "Política de privacidad", href: "/politica-de-privacidad" }}
        />
      </main>
      <Footer />
    </>
  );
}
