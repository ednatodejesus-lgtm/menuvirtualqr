import Card from "../ui/Card";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

export default function AppearanceSettings() {

    return (

        <Card title="Aparência">

            <Input
                label="Logótipo"
                type="file"
            />

            <Select
                label="Tema"

                options={[

                    {
                        value: "modern",
                        label: "Moderno"
                    },

                    {
                        value: "minimal",
                        label: "Minimalista"
                    },

                    {
                        value: "classic",
                        label: "Clássico"
                    }

                ]}
            />

            <Button>

                Guardar Aparência

            </Button>

        </Card>

    );

}