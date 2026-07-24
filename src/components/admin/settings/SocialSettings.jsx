import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function SocialSettings() {

    return (

        <Card title="Redes Sociais">

            <Input
                label="Facebook"
                placeholder="https://facebook.com/..."
            />

            <Input
                label="Instagram"
                placeholder="https://instagram.com/..."
            />

            <Input
                label="TikTok"
                placeholder="https://tiktok.com/@..."
            />

            <Input
                label="Website"
                placeholder="https://..."
            />

            <Button>

                Guardar Redes Sociais

            </Button>

        </Card>

    );

}