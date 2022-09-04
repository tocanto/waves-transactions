import { useEffect } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonList, IonItemDivider, IonItem, IonRow, IonCol } from '@ionic/react';
//import { useParams } from 'react-router';
//import './MassTransfer.css';

declare var window: any

// Functional Component
const KeeperSwap: React.FC = () => {

  // Parámetros del router
  //const { name } = useParams<{ name: string; }>();
  let path = window.location.pathname.replace(/\//,'');

  useEffect(() => {
    window.KeeperSwapWidget.create(
      document.querySelector('#keeper-swap-widget'), {
        referrer: 'tocanto',
        // other widget settings like toAssetIds, theme etc.
        theme: 'dark'
      }
    );
  }, [] )

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{path}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonItemDivider></IonItemDivider>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{path}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonRow>
          <IonCol size="2">
          </IonCol>
          <IonCol size="6">
            <IonList>
              <IonItem id="keeper-swap-widget"></IonItem>
            </IonList>
          </IonCol>
          <IonCol></IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default KeeperSwap;