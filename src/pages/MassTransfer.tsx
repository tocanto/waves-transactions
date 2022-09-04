import { useState } from 'react';
import { IonButtons, IonButton, IonContent, IonModal, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar, IonIcon, useIonToast, IonList, IonItemDivider, IonInput, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonRadioGroup, IonRadio, IonListHeader } from '@ionic/react';
//import { useParams } from 'react-router';
//import ExploreContainer from '../components/ExploreContainer';
import './MassTransfer.css';
import { hourglassOutline, hourglassSharp } from 'ionicons/icons';

// Importaciones Waves
/*
import { Signer } from '@waves/signer';
import { ProviderKeeper } from '@waves/provider-keeper';
*/

declare var window: any

// Functional Component
const MassTransfer: React.FC = () => {

  // Parámetros del router
  //const { name } = useParams<{ name: string; }>();
  let path = window.location.pathname.replace(/\//,'').replace(/\/+$/, '');

  // Modal
  const [isOpen, setIsOpen] = useState(false);

  // Toast notification
  const [present] = useIonToast();

  // Arreglo vacío para agregar las transferencias y sus montos
  const transfers: any = [];

  // ion inputs
  const [assetID, setAssetID] = useState<string>();
  const [attachment, setAttachment] = useState<string>('');
  const [address, setAddress] = useState<string>();
  const [amount, setAmount] = useState<string>();
  const [transfer, setTransfer] = useState(transfers);
  const [donationAmount, setDonationAmount] = useState<string>();

  // Conversión de monto donado (String to Number)
  const montoInput = (donado: any) => {
    const donado1 = Number(donado);
      return Number((donado1*(10**8)).toFixed());
  }

  const donation = montoInput(donationAmount);

  // Para Base58Encode
  //const base58 = require('base58-encode');

  // Manejador del envío de datos al arreglo
  const handleSubmit = (e: any) => {
    e.preventDefault();
    addTransfer(address, amount);
    setAddress('');
    setAmount('');
  }

  // Agrega las transferencias al arreglo vacío
  const addTransfer = ( address: any, amount: any ) => {
    let copy = [...transfer];
    const monto = Number(amount);
    copy = [...copy, { amount: Number((monto*(10**8)).toFixed()), recipient: address }];
    setTransfer(copy);
  }

  // Creación del objeto para la transferencia en masa
  const codificar = (adjunto: string) => {
    setAttachment(adjunto);
  }

  /*
  //Objeto de transferencia Waves Keeper
  let data = {
    assetId: assetID,
    attachment: base58(attachment),
    transfers: transfer
  };
  */

  // Objeto de transferencia KeeperWallet
  let dataKeeper = {
    type: 11,
    data: {
      totalAmount: {assetId: assetID, coins: 0},
      transfers: transfer,
      attachment: attachment,
    },
  }

  // Función para generar el renderizado de las transferencias agregadas
  const transferencias = transfer.map((anObjectMapped: any, index: any) => {
    return (
          <IonRow key={`${anObjectMapped.recipient}_{anObjectMapped.amount}`}>
            <IonCol size="8">
              <IonItem>
                <IonLabel>{anObjectMapped.recipient}</IonLabel>
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel>{(anObjectMapped.amount)/(10**8)}</IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
    );
})

  // Auth Function
  const getAuthData = async () => {
    try {
      const state = await window.KeeperWallet.auth({ data: 'Auth on my site' });
      console.log(state); // displaying the result on the console
      /*... processing data */
      const logueado = (() => {
        present('You are logged in', 3000)
      })();
      setIsOpen(false);
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error); // displaying the result on the console
      /*... processing errors */
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const desconectar = async () => {
    const desconectado = (() => {
      present('You are disconnected', 3000)
    })();
    setIsLoggedIn(false);
  }


/*
// Función de transferencia en masa WavesKeeper
const massTransferTransaction = async () => {
  try {
    const [tx] = await signer
    .massTransfer(data)
    .broadcast();
    signer.waitTxConfirm(tx, 1).then((tx) => {
      // Tx have one confirmation
      console.log('Transacción confirmada');
      const confirmada = (() => {
        present('Transacción confirmada', 3000)
      })()
    });
  } catch (e) {
    console.error('transacción no enviada');
  }
}
*/

// Función de transferencia en masa KeeperWallet
const massTransfr = async () => {
  window.KeeperWallet.signAndPublishTransaction(dataKeeper)
  .then((tx: any) => {
    const confirmada = (() => {
      present('Transaction confirmed', 3000)
    })()
  })
  .catch((error: any) => {
    console.error('Something went wrong', error);
  });
}

/*
//Función Donaciones WavesKeeper
// Transfer Transaction
const transferTransaction = async (donacion: number) => {
  try {
    const [transfer] = await signer
    .transfer({
      recipient: direccion,
      amount: donacion*(10**8),
      assetId: null, // equals to WAVES
    })
    .broadcast();
    signer.waitTxConfirm(transfer, 1).then((transfer) => {
      // Tx have one confirmation
      console.log('Transacción confirmada');
      const confirmada = (() => {
        present('Gracias por su donación', 3000)
      })()
    });
  } catch (e) {
    console.error('transacción no enviada');
  }
}
*/

//Función Donaciones KeeperWallet
// Transfer Transaction
const transfTransaction = async (donacion: number) => {
  window.KeeperWallet.signAndPublishTransaction({
    type: 4,
    data: {
      amount: { tokens: donacion*(1), assetId: 'WAVES' },
      fee: { tokens: '0.001', assetId: 'WAVES' },
      recipient: direccion,
    },
  })
    .then((tx: any) => {
      const confirmada = (() => {
        present('Thank you for your donation', 3000)
      })()
    })
    .catch((error: any) => {
      console.error('Something went wrong', error);
    });
}

//Selección provider (testnet o mainnet)
const [selected, setSelected] = useState<string>('testnet');

let direccion = (selected==='testnet') ? '3MtcgyQa6DW4aSGVCzpub2FRBSAVb39a7yc' : '3P58vMvwJY1GUbdRwMK16KRGY4dcpjb24SR';
/*
let seleccionado = (selected==='testnet') ? 'https://nodes-testnet.wavesnodes.com' : 'https://nodes.wavesnodes.com';

// Objeto Signer
const signer = new Signer({
  // Specify URL of the node on Testnet
  NODE_URL: seleccionado
});
const keeper = new ProviderKeeper();
signer.setProvider(keeper);
*/

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButton slot="end" className={`${isLoggedIn ? " activo" : ""}`} onClick={() => {setIsOpen(true)}}>
              Connect wallet
          </IonButton>
          <IonButton slot="end" className={`${!isLoggedIn ? " activo" : ""}`} onClick={ desconectar }>
              Disconnect
          </IonButton>
          <IonModal isOpen={isOpen}>
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Connect wallet</IonTitle>
                    <IonButtons slot="end">
                      <IonButton onClick={() => setIsOpen(false)}>X</IonButton>
                    </IonButtons>
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">
              <IonList>
                <IonRadioGroup value={selected} onIonChange={e => setSelected(e.detail.value)}>
                  <IonListHeader>
                    <IonLabel>Select Net</IonLabel>
                  </IonListHeader>

                  <IonItem>
                    <IonLabel>Testnet</IonLabel>
                    <IonRadio slot="start" value="testnet" />
                  </IonItem>

                  <IonItem>
                    <IonLabel>Mainnet</IonLabel>
                    <IonRadio slot="start" value="mainnet" />
                  </IonItem>

                </IonRadioGroup>
            </IonList>
                <IonButton onClick={ getAuthData } expand="block" fill="outline">Keeper Wallet
                <IonIcon slot="end" ios={hourglassOutline} md={hourglassSharp} /> 
                </IonButton>
              </IonContent>
          </IonModal>
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
        <IonList>
          <IonItem>
            <IonLabel position="floating">Asset id</IonLabel>
            <IonInput value={assetID} onIonChange={e => setAssetID(e.detail.value!)} clearInput></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Attachment</IonLabel>
            <IonInput value={attachment} onIonChange={e => setAttachment(e.detail.value!)} onIonBlur={e => codificar((String(e.target.value)))} clearInput></IonInput>
          </IonItem>
        </IonList>
        <IonGrid>
        <form onSubmit={ handleSubmit }>
          <IonRow>
            <IonCol size="8">
            <IonItem>
            <IonInput value={address} placeholder="Address" onIonChange={e => setAddress(e.detail.value!)} clearInput></IonInput>
          </IonItem>
            </IonCol>
            <IonCol>
            <IonItem>
            <IonInput value={amount} placeholder="Amount" onIonChange={e => setAmount(e.detail.value!)} clearInput></IonInput>
          </IonItem>
            </IonCol>
            <IonCol>
              <IonButton type='submit'>+</IonButton>
            </IonCol>
          </IonRow>
        </form>
        </IonGrid>
        <IonItemDivider></IonItemDivider>
        <IonContent>
          <IonRow>
            <IonCol size="4">
            </IonCol>
            <IonCol>
            <IonLabel>Addresses added</IonLabel>
            </IonCol>
            <IonCol></IonCol>
          </IonRow>
          {/*-- List of Text Items --*/}
          <IonList>
          { transferencias }
          </IonList>
          <IonGrid>
            <IonRow>
              <IonCol size="4">
              </IonCol>
              <IonCol size="6">
                <IonButton onClick={ massTransfr }>Send</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonItemDivider></IonItemDivider>
          <IonGrid>
            <IonRow>
              <IonCol size="4">
              </IonCol>
              <IonCol size="8">
                <IonLabel>Donate crypto to the author!</IonLabel>
              </IonCol>
            </IonRow>
            </IonGrid>
            <IonGrid>
            <IonRow>
              <IonCol size="4">
              </IonCol>
              <IonCol size="8">
                <IonButton size="small" onClick={ () => transfTransaction(0.10) }>
                  0.10
                  <span className="waves__logo"></span>
                </IonButton>
                <IonButton size="small" onClick={ () => transfTransaction(1) }>
                  1
                  <span className="waves__logo"></span>
                </IonButton>
                <IonButton size="small" onClick={ () => transfTransaction(5) }>
                  5
                  <span className="waves__logo"></span>
                </IonButton>  
                <IonButton size="small" onClick={ () => transfTransaction(Number((donation)/(10**8))) }>
                  <IonInput className='boton' value={donationAmount} placeholder="Amount" onIonChange={e => setDonationAmount(e.detail.value!)} ></IonInput>
                  <span className="waves__logo"></span>
                </IonButton>
              </IonCol>
            </IonRow>
            </IonGrid>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default MassTransfer;