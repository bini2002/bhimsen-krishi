import { GetServerSideProps } from "next";
import { GoBackButton } from "@/components/globalcomponents/Button";
import PageLayout from "@/components/globalcomponents/PageLayout";
import CompleteKYC from "@/components/pagecomponents/userslistpage/CompleteKYC";

interface Props {
  slug: string | null;
}

export default function AddProfilePage({ slug }: Props) {
  console.log("hey", slug);
  if (!slug) {
    return (
      <PageLayout>
        <GoBackButton />
        <p>User Not Found</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <GoBackButton />
      <CompleteKYC userId={slug} />
    </PageLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params || {};

  if (!slug || typeof slug !== "string") {
    return {
      props: {
        slug: null,
      },
    };
  }

  return {
    props: {
      slug,
    },
  };
};
