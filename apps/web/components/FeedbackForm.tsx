import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from 'components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from 'components/ui/form';
import { formSchema } from './FeedbackButton';
import { Textarea } from 'components/ui/textarea';

interface FeedbackFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  error: boolean;
}

const FeedbackForm = (props: FeedbackFormProps) => {
  const { onSubmit, error } = props;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      feedback: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="feedback"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Leave your feedback here"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                We value your feedback. Give us as much detail as you want.
              </FormDescription>
              {error && (
                <FormMessage>
                  Something went wrong. Please try submitting again
                </FormMessage>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default FeedbackForm;
