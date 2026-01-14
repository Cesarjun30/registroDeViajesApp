import {Navigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';


const PrivateRoute = ({children}) =>{

    const { user } = useAuth();
    
    //const user = true // similar que usuario esta autenticado
       
    if(!user){

        return <Navigate to="/login" />;
    }
    return children
};


export default PrivateRoute;





// Problema Actual no puedo Renderizar al componente de Experiences.jsx despues de hacer login