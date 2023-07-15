interface PageProps {
  params: {
    postId: string;
  };
}

const page = ({ params }: PageProps) => {
  return (
    <div>
      <h1>page</h1>
    </div>
  );
};
export default page;
