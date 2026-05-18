import React, {
    useEffect,
    useRef,
    useState
} from "react";

import "../styles/compsStyles/Notificaciones.css";

import NotificacionesIcono from "../../images/notificaciones(1).png";

const API_URL = "api/notificaciones.php";
const API_RESPONDER_URL ="api/acciones_notificaciones.php";

export const Notificaciones = () => {

    const [notificaciones, setNotificaciones] = useState([]);

    const [open, setOpen] = useState(false);

    const [error, setError] = useState(null);

    const [data, setData] = useState(null);
    
    const popupRef = useRef();


    const obtenerNotificaciones = async () => {

        try{

            const response = await fetch(

                API_URL, {

                    credentials: "include"  
                }

            );

            const data = await response.json();

            setNotificaciones(data);

        }catch(error){

            console.error(error);

        }

    };


    useEffect(() => {

        obtenerNotificaciones();

        const interval = setInterval(() => {

            obtenerNotificaciones();

        }, 15000);

        return () => clearInterval(interval);

    }, []);


    useEffect(() => {

        const handleClickOutside = (event) => {

            if(
                popupRef.current &&
                !popupRef.current.contains(event.target)
            ){

                setOpen(false);

            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    const responderNotificacion = async(id, opcion) => {

        try{

            const response = await fetch(

                API_RESPONDER_URL, 

                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        id_detalle_entrada: id,
                        opcion: opcion

                    })

                }

            );

            const data = await response.json();

            if(data.success){

                obtenerNotificaciones();

            }else{

                setError(data.error);
                setData(data.data);
            }
        }catch(error){

            console.error(error);

        }

    };


    return (

        <div
            className="contenedor-notificaciones"
            ref={popupRef}
        >

            <button
                className="btn-campana"
                onClick={() => setOpen(!open)}
            >

                <figure className="icono-campana">

                    <img
                        src={NotificacionesIcono}
                        alt="Notificaciones"
                    />
                </figure>
                {notificaciones.length > 0 && (

                    <span className="badge">

                        {notificaciones.length}

                    </span>

                )}

            </button>


            {open && (

                <div className="popup-notificaciones">

                    <h3>

                        Notificaciones

                    </h3>


                    {notificaciones.length === 0 ? (

                        <p>

                            No hay notificaciones

                        </p>

                    ) : (

                        notificaciones.map((n, index) => (

                            <div
                                key={index}
                                className={`notificacion ${n.tipo}`}
                            >

                                <p>

                                    {n.mensaje}
                               
                                </p>
                                {error && n.tipo === 'vencimiento' && n.id_detalle_entrada ==
                                 data.id_detalle_entrada &&(
                                    <p className="error">
                                        {error}
                                    </p>
                                )}
                                {n.tipo === 'vencimiento' && (

                                    <div className="acciones">

                                        <p>

                                            ¿Desea crear una salida automática?

                                        </p>

                                        <button
                                            className="btn-si"
                                            onClick={() =>
                                                responderNotificacion(
                                                    n.id_detalle_entrada,
                                                    1
                                                )
                                            }
                                        >

                                            Sí

                                        </button>


                                        <button
                                            className="btn-no"
                                            onClick={() =>
                                                responderNotificacion(
                                                    n.id_detalle_entrada,
                                                    2
                                                )
                                            }
                                        >

                                            No

                                        </button>

                                    </div>

                                )}

                            </div>

                        ))

                    )}

                </div>

            )}

        </div>

    );

};