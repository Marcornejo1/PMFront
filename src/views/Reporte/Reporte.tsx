import "./Reporte.css";
import { useNavigate } from "react-router-dom";
import Button from "../../components/buttons/Button";
import { useForm } from "react-hook-form";
import Input from "../../components/inputs/Input";
import { useState, useEffect } from "react";

interface FormData{
    campo1: string;
    campo2: string;
    campo3: string;
    campo4: string;

}

const Reporte = () => {

    const [register, handleSubmit, getValues, setValue] = useForm<FormData>({ defaultValues: {campo1: '', campo2: '', campo3: '', campo4: ''} });
    const [openModal, setOpenModal] = useState<"warning" | "success" | "error" | "loading">("loading");

    const render=() => {
        return(
            <main className="Reporte">

            </main>
                );

}

export default Reporte;
