"use client";

import { useCallback, useEffect, useRef } from "react";
import type EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

import { uploadFiles } from "@/lib/uploadthing";
import { PostType, postSchema } from "@/lib/validators/post";
import { useCreatePost } from "@/hooks/mutations/posts";
import { Button } from "@/components/ui/button";

const Editor = ({ subredditId }: { subredditId: string }) => {
  const editorRef = useRef<EditorJS>();
  const firstRender = useRef(true);

  const { mutate, isLoading, isSuccess } = useCreatePost();
  const { register, handleSubmit } = useForm<PostType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      subredditId: subredditId,
      title: "",
      content: null,
    },
  });

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const List = (await import("@editorjs/list")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Image = (await import("@editorjs/image")).default;
    const Quote = (await import("@editorjs/quote")).default;
    const Marker = (await import("@editorjs/marker")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;

    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        onReady: () => {
          editorRef.current = editor;
        },
        placeholder: "Start writing your post...",
        inlineToolbar: true,
        minHeight: 0,
        data: {
          blocks: [],
        },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: Image,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles({
                    files: [file],
                    endpoint: "imageUploader",
                  });

                  return { success: 1, file: { url: res.fileUrl } };
                },
              },
            },
          },
          list: List,
          embed: Embed,
          quote: Quote,
          marker: Marker,
          inlineCode: InlineCode,
          code: Code,
        },
      });
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
    };

    if (editorRef.current) return;
    if (firstRender.current) {
      init();
    }

    firstRender.current = false;
  }, [initializeEditor]);

  const onSubmit = async (data: PostType) => {
    const blocks = await editorRef.current?.save();

    const payload: PostType = {
      title: data.title,
      content: blocks,
      subredditId: data.subredditId,
    };

    mutate(payload);
  };
  return (
    <>
      <div className="w-full p-4">
        <form
          id="subreddit-post-form"
          className="w-fit"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="prose dark:prose-invert">
            <TextareaAutosize
              autoFocus
              placeholder="Title"
              className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold"
              {...register("title")}
            />
            <div id="editorjs" />
          </div>
        </form>
      </div>
      <div className="w-full flex justify-end">
        <Button
          type="submit"
          className="w-full"
          form="subreddit-post-form"
          isLoading={isLoading}
          disabled={isLoading || isSuccess}
        >
          Post
        </Button>
      </div>
    </>
  );
};
export default Editor;
