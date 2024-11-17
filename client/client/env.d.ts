declare module '@env' {
    export const NEXT_PUBLIC_FIREBASE_API_KEY: string;
}   

declare module '*.png' {
    const value: any;
    export default value;
}  {/* questo serve per dichiarare a typescript che le immagine possono essere importate come moduli ed utilizzate come variabili */}
