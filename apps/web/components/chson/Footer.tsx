import { Separator } from 'components/ui/separator';

export function Footer() {
  return (
    <footer className="mt-12">
      <Separator />
      <div className="px-2 py-5 text-sm text-muted-foreground">
        <span>ChSON is a JSON format for cheatsheets.</span>
      </div>
    </footer>
  );
}
