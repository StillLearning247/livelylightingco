import { Contact as ContactComponent } from "../components/Contact";
import { Process } from "../components/Process";

const Contact = () => {
  return (
    <main className="pt-20">
      <Process />
      <ContactComponent />
    </main>
  );
};

export default Contact;
