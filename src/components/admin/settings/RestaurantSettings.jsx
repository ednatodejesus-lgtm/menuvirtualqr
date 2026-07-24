import Card from "../ui/Card";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";

export default function RestaurantSettings() {

    return (

        <Card title="Informações do Restaurante">

            <Input
                label="Nome"
                placeholder="Nome do restaurante"
            />

            <Textarea
                label="Descrição"
                placeholder="Descreva o restaurante"
            />

            <Input
                label="Telefone"
                placeholder="+244..."
            />

            <Input
                label="Email"
                placeholder="email@restaurante.com"
                type="email"
            />

            <Textarea
                label="Endereço"
                placeholder="Endereço completo"
                rows={3}
            />

            <Button>

                Guardar Alterações

            </Button>

        </Card>

    );

}