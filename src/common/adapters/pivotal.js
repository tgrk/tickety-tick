import { $all, $classed, $closest, $data, $find, $has, $text, $value } from './helpers';

const cls = ctx => ['bug', 'chore', 'feature', 'release'].find(c => $classed(ctx, c));

function multiple(elements, collapsed) {
  return elements.map((story) => {
    const id = $data(story, 'id').toString();

    const title = collapsed
      ? $text('.story_name', story)
      : $value('.editor.name', story);

    const type = cls(story);

    return { id, title, type };
  });
}

const adapter = {
  inspect(loc, doc, fn) {
    if (doc.body.id !== 'tracker') return fn(null, null);

    if ($has('div.story .selector.selected', doc)) { // selected stories
      const selection = $all('div.story .selector.selected', doc).map(e => $closest('.story', e));
      const tickets = multiple(selection, true);
      return fn(null, tickets);
    } else if ($has('div.story .details', doc)) { // opened stories
      const opened = $all('div.story .details', doc).map(e => $closest('.story', e));
      const tickets = multiple(opened, false);
      return fn(null, tickets);
    } else if ($has('.story.maximized', doc)) { // single story in separate tab
      const story = $find('.story.maximized', doc);
      const id = $value('aside input.id', story).replace(/^#/, '');
      const title = $text('.editor.name', story);
      const type = cls(story);
      const tickets = [{ id, title, type }];
      return fn(null, tickets);
    }

    return fn(null, null);
  },
};

export default adapter;
