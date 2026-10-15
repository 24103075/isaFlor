import React from 'react';
import imagenEmprendimiento from '../assets/IMG_6811_Original.webp';
import '../styles/pages/Nosotros.css';


const Nosotros = () => {
  return (
    <main className="nosotros-page">
      <h1>Conócenos</h1>
      <section className="nosotros-portada container py-4 py-md-5">
        <div className="row align-items-center g-4">
            <div className="col-12 col-lg-5">
            <p className="nosotros-etiqueta">NUESTRA HISTORIA · MELIPILLA</p>
            <p className="nosotros-bajada">
                Una pasión familiar por cultivar flores frescas desde hace más de dos décadas.
            </p>
            </div>

            <div className="col-12 col-lg-7">
            <img
                className="nosotros-imagen"
                src={imagenEmprendimiento}
                alt="Imagen del emprendimiento IsaFlor"
            />
            </div>
        </div>
        </section>

      <section className="my-4">
        <h2>Nuestra historia</h2>
        <p>Hace aproximadamente 23 años, lo que hoy conocen como Isaflor comenzó como una simple pasión: 
            el amor por la tierra, el cuidado de la naturaleza y la belleza de cultivar flores. Lo que 
            empezó como un pequeño hobbie en nuestro hogar, con el paso del tiempo y gracias a la dedicación
            de toda la familia, se transformó en mucho más que un trabajo: se convirtió en el sustento de nuestro
            hogar y en el proyecto de nuestras vidas.
            Ubicados en la hermosa comuna de Melipilla, hemos dedicado más de dos décadas a sembrar, cuidar y 
            cosechar con nuestras propias manos flores de corte de la más alta calidad y frescura.</p>
      </section>

      <section className="my-4">
        <h2>Qué nos inspira</h2>
        <p>Lo que verdaderamente nos motivó a dar el salto e instalarnos en el Mercado Campesino de Melipilla fue
             el deseo de ser ese puente humano. Nos impulsó la idea de ofrecer flores vivas, frescas y cuidadas con
              las mismas manos de quienes las cultivaron, creando un refugio donde la comunidad supiera que siempre
               encontrará una forma sincera y natural de transmitir sus emociones.</p>
      </section>

            <section className="nosotros-servicios container py-4">
        <h2>Nuestro compromiso</h2>

        <div className="nosotros-servicios__lista">
            <article>
            <h3>Flores de estación</h3>
            <p>Variedades vivas y coloridas, seleccionadas en cada temporada del año.</p>
            </article>

            <article>
            <h3>Ramos y arreglos personalizados</h3>
            <p>Diseños preparados para ocasiones especiales y adaptados a lo que deseas expresar.</p>
            </article>

            <article>
            <h3>Atención directa en el Mercado Campesino</h3>
            <p>Un punto de encuentro donde puedes elegir personalmente tus flores.</p>
            </article>

            <article>
            <h3>Eventos y pedidos especiales</h3>
            <p>Flores frescas para celebraciones y momentos significativos.</p>
            </article>
        </div>
    </section>
    </main>
  );
};

export default Nosotros;