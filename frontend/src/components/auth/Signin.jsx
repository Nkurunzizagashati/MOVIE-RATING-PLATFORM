import Container from "../Container";
import FormInput from "../form/FormInput";
import Title from "../form/Title";

const Signin = () => {
  return (
    <div className=" fixed inset-0 bg-primary -z-10 flex justify-center items-center">
      <Container>
        <form className=" border-secondary rounded p-6 w-72">
          <Title>Sign in</Title>
          <FormInput
            name="email"
            label="Email"
            placeholder="fab@gmail.com"
            type="text"
          />
          <FormInput
            name="email"
            label="Password"
            placeholder="********"
            type="password"
          />
        </form>
      </Container>
    </div>
  );
};

export default Signin;
