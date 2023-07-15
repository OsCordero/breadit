interface PageProps {
  params: {
    postId: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page = ({ params }: PageProps) => {
  return (
    <div>
      <h1>page</h1>
    </div>
  );
};
export default page;
