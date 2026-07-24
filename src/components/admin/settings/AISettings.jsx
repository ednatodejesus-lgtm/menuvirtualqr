import Card from "../ui/Card";
import Button from "../ui/Button";

export default function AISettings() {

    return (

        <Card title="Inteligência Artificial">

            <p>

                Utilize a IA para melhorar automaticamente o perfil do restaurante.

            </p>

            <Button>

                Gerar Tema

            </Button>

            <br /><br />

            <Button variant="secondary">

                Melhorar Descrição

            </Button>

            <br /><br />

            <Button variant="secondary">

                Gerar Paleta de Cores

            </Button>

        </Card>

    );

}