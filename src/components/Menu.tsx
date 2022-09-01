import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonToggle,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
//import { archiveOutline, archiveSharp, bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import { sendOutline, sendSharp } from 'ionicons/icons';
import './Menu.css';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Mass Transfer',
    url: '/MassTransfer',
    iosIcon: sendOutline,
    mdIcon: sendSharp
  }
];

const Menu: React.FC = () => {
  const location = useLocation();

  const toggleDarkModeHandler = () => document.body.classList.toggle('dark');

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="mass-transfer">
          <IonListHeader>Waves Transactions
          <IonItem className="alinear" lines="none">
            <IonToggle
              className="icon-custom"
              slot="end"
              name="darkMode"
              onIonChange={toggleDarkModeHandler}
            />
          </IonItem>
          </IonListHeader>
          <IonNote>tocanto.dev</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

      </IonContent>
    </IonMenu>
  );
};

export default Menu;
