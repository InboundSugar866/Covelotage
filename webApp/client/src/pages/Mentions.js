import React from 'react'
import Footer from '../components/Footer';

import backgroundImage from '../assets/Fond_urbain.jpg';
import '../styles/Mentions.css';

const Mentions = () => {
    return (
      <div >
        <div className='backgroundImage' style={{backgroundColor: `#63A3A0`}}>
          <div class="p-5 rounded text-justify fw-bold">

            <div class='mb-5'>
              <h1 class="fw-bold text-large">Covelotage</h1>
              <h2>Votre Communaute Cycliste</h2>
              <p>Le covelotage est une initiative visant à rendre l’utilisation du vélo plus accessible au quotidien, en encourageant les cyclistes grâce à la mise en relation avec d’autres utilisateurs partageant des itinéraires similaires.</p>
            </div>


            <h1>Mentions legales</h1>
            <div class='text-justify px-5'>
              <h3 class="fw-bold">Directeur de publication</h3>
              <div class='text px-5'>
                Denis HEFTRE - Président<br/>
                Association PDIE Technopôle Nancy Brabois<br/>
                chez ADH - 5 rue de l’aviation - 54600 VILLERS-LES-NANCY
              </div>


              <h3 class='fw-bold  mt-5'>Conception et animation du site</h3>
              <div class='text px-5'>
                <div>ENSEM Conseil - 2 avenue de la forêt de Haye 54500 VANDOEUVRE-LES-NANCY<br/>
                      <br/></div>
                <div>Hébergement - XXXX</div>
              </div>
              

              <h3 class='fw-bold  mt-5'>Conditions generales d'utilisation du site et des services proposes</h3>
              <div class='text px-5'>
                <div>L’utilisation du site www.covelotage.fr implique l’acceptation pleine et entière des conditions générales d’utilisation ci-après décrites. Ces conditions d’utilisation sont susceptibles d’être modifiées ou complétées à tout moment, les utilisateurs du site www.covelotage.fr sont donc invités à les consulter de manière régulière.<br/>
                  <br/>
                  Aucun élément composant le site ne peut être copié, reproduit, modifié, réédité, chargé, dénaturé, transmis ou distribué de quelque manière que ce soit, sous quelque support que ce soit, de façon partielle ou intégrale, sans l’autorisation écrite et préalable du PDIE Technopôle Nancy Brabois.<br/>
                  <br/>
                  Toute utilisation non expressément autorisée du site ou de ses éléments constituerait une atteinte aux droits du PDIE Technopôle Nancy Brabois passible notamment de contrefaçon sanctionnée par les articles L 355-2 et suivants du Code de la Propriété.
                </div>
              </div>

              <h3 class='fw-bold  mt-5'>Propriete intelectuelle et contrefacon</h3>
                <div class='text px-5'>
                <div>La présentation et chacun des éléments, y compris le nom de domaine, les marques, logos, enseignes, dessins, illustrations, photographies, textes, graphiques et autres fichiers apparaissant sur le présent site, sont protégés par les lois en vigueur sur la propriété intellectuelle, et appartiennent au PDIE Technopôle Nancy Brabois  ou font l’objet d’une autorisation d’utilisation.<br/>
                  <br/>
                  Ce site est normalement accessible à tout moment aux utilisateurs. Une interruption pour raison de maintenance technique peut être toutefois décidée par le PDIE Technopôle Nancy Brabois qui s’efforcera alors de communiquer préalablement et dans la mesure du possible, les dates et heures de l’intervention aux utilisateurs.<br/>
                  <br/>
                  Le site www.covelotage.fr est mis à jour régulièrement par les membres de l’association PDIE Technopôle Nancy Brabois. De la même façon, les mentions légales peuvent être modifiées à tout moment : elles s’imposent néanmoins à l’utilisateur qui est invité à s’y référer le plus souvent possible afin d’en prendre connaissance.
                </div>
              </div>

              <h3 class='fw-bold  mt-5'>Gestion des donnees personnelles</h3>
              <div class='text px-5'>
                <div>En France, les données personnelles sont notamment protégées par la loi n° 78/87 du 6 janvier 1978, la loi n° 2004/801 du 6 août 2004, l’article L. 226-13 du Code pénal, la Directive Européenne du 24 octobre 1995 et le règlement n° 2016/679 dit, Règlement sur la Protection des Données (RGPD), de l’Union Européenne.<br/>
                  <br/>
                  En tout état de cause le PDIE Technopôle Nancy Brabois ne collecte des informations personnelles relatives à l’utilisateur que pour le besoin des services proposés par le site www.covelotage.fr :<br/>
                  <br/>
                  - Nom<br/>
                  - Prénom<br/>
                  - Adresse<br/>
                  - Numéro de téléphone<br/>
                  - Email<br/>
                  <br/>
                  L’utilisateur consent à fournir ces informations lorsqu’il procède par lui-même à leur saisie dans un formulaire. Il est alors précisé à l’utilisateur du site www.covelotage.fr l’obligation ou non de fournir ces informations.<br/>
                  <br/>
                  [Texte de description des durées de conservation des données.]<br/>
                  <br/>
                  Conformément aux dispositions du RGPD, tout utilisateur dispose d’un droit d’information, d’accès, de rectification, d’effacement, d’opposition et de portabilité des données personnelles le concernant. Pour exercer l’un de ces droits, il suffit à l’utilisateur d’effectuer sa demande par voie postale ou par mail à l’attention de [personne à solliciter] (mail).<br/>
                  <br/>
                  Aucune information personnelle de l’utilisateur du site www.covelotage.fr n’est publiée à l’insu de l’utilisateur, échangée, transférée, cédée ou vendue sur un support quelconque à des tiers. Seule l’hypothèse du changement de statut du PDIE Technopôle Nancy Brabois et de ses droits permettrait la transmission desdites informations à l’éventuelle entité qui serait à son tour tenu de la même obligation de conservation et de modification des données vis à vis de l’utilisateur du site www.covelotage.fr.
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  };
  
  export default Mentions;