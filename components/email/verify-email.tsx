import {
  Body,
  Button,
  Column,
  Container,
  Heading,
  Html,
  Img,
  Link,
  pixelBasedPreset,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "react-email";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

interface VerifyEmailProps {
  username: string;
  verifyUrl: string;
}

export const VerifyEmail = ({ username, verifyUrl }: VerifyEmailProps) => (
  <Tailwind
    config={{
      presets: [pixelBasedPreset],
      theme: {
        extend: {
          colors: {
            primary: "#F22222",
          },
        },
      },
    }}
  >
    <Html>
      <Body className="bg-bg-2 m-0 text-center font-sans">
        <Preview>Confirmer votre adresse email</Preview>
        <Container className="mobile:mt-0 mx-auto mt-8 w-full max-w-160">
          <Section>
            <Section className="bg-bg mobile:px-2 px-6 py-4">
              <Section className="mb-3 px-6">
                <Row>
                  <Column className="w-1/2 py-1.75 align-middle">
                    <Row>
                      <Column className="w-8 align-middle">
                        <Img
                          src={`${baseUrl}/static/shared/logo-black.png`}
                          alt=""
                          width={23}
                          className="block"
                        />
                      </Column>
                    </Row>
                  </Column>
                  <Column align="right" className="w-1/2 py-1.75 align-middle">
                    <Text className="font-13 m-0 text-right font-sans">
                      <span className="text-fg-3">Census App by Next Step</span>
                    </Text>
                  </Column>
                </Row>
              </Section>

              <Section className="bg-bg-2 mobile:px-6 mobile:py-12 rounded-[8px] px-10 py-16 text-center">
                <Section className="mb-3">
                  <Img
                    src={`${baseUrl}/static/shared/logo-black.png`}
                    alt="Logo"
                    width={48}
                    className="mx-auto mb-5 block"
                  />
                  <Heading as="h1" className="font-28 text-fg m-0 font-sans">
                    Vous y êtes presque {username} !
                  </Heading>
                </Section>

                <Text className="font-16 text-fg-2 mx-auto mt-0 mb-8 max-w-95 text-center font-sans">
                  Merci de vous être inscrit.
                  <br />
                  Pour vérifier votre compte, veuillez confirmer votre adresse
                  e-mail.
                </Text>

                <Section className="mb-6 text-center">
                  <Button
                    href={verifyUrl}
                    style={{ backgroundColor: "#F22222" }}
                    className="font-semibold text-fg-inverted inline-block text-white rounded-lg px-7 py-4 text-center font-sans leading-6"
                  >
                    Confirmez votre email
                  </Button>
                </Section>

                <Text className="font-13 text-fg-3 mx-auto mt-8 mb-0 max-w-100 text-center font-sans">
                  Si vous n&apos;êtes pas à l&apos;origine de cette demande{" "}
                  {username},
                  <br />
                  veuillez ignorer ce mail.
                </Text>
              </Section>

              {/* Footer */}
              <Section className="bg-bg">
                <Row>
                  <Column className="px-6 py-10 text-center">
                    <Text className="font-13 text-fg-3 mx-auto mt-0 mb-8 max-w-70 text-center font-sans">
                      Census App simplifie la gestion des ventes de vos
                      télévendeurs, au quotidien.
                    </Text>

                    <Section className="mb-8">
                      <Link
                        href="https://example.com/"
                        className="inline-block px-2 align-middle"
                      >
                        <Img
                          src={`${baseUrl}/static/shared/social-x-black.png`}
                          alt="X"
                          width={18}
                          className="block"
                        />
                      </Link>
                      <Link
                        href="https://example.com/"
                        className="inline-block px-2 align-middle"
                      >
                        <Img
                          src={`${baseUrl}/static/shared/social-in-black.png`}
                          alt="LinkedIn"
                          width={18}
                          className="block"
                        />
                      </Link>
                      <Link
                        href="https://example.com/"
                        className="inline-block px-2 align-middle"
                      >
                        <Img
                          src={`${baseUrl}/static/shared/social-yt-black.png`}
                          alt="YouTube"
                          width={18}
                          className="block"
                        />
                      </Link>
                      <Link
                        href="https://example.com/"
                        className="inline-block px-2 align-middle"
                      >
                        <Img
                          src={`${baseUrl}/static/shared/social-gh-black.png`}
                          alt="GitHub"
                          width={18}
                          className="block"
                        />
                      </Link>
                    </Section>

                    <Text className="font-11 text-fg-3 mt-4 mb-5 text-center font-sans">
                      Boulevard de Karthala, Moroni
                      <br />
                      Moroni Djivani, Comores, 94102
                    </Text>
                    <Text className="font-11 text-fg-3 m-0 text-center font-sans">
                      <Link href="#" className="text-fg-3 text-[#F22222]">
                        Se désabonner
                      </Link>{" "}
                      des emails marketing de Census App by Next Step.
                    </Text>
                  </Column>
                </Row>
              </Section>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

export default VerifyEmail;
