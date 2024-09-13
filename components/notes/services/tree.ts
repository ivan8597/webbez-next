import { PostNode } from "../types";

export const getNotesTree = (
  oPosts: PostNode[]
): { treeNotes: PostNode[]; dPosts: Record<string, PostNode> } => {
  const posts = oPosts.map((post) => ({ ...post })); //массив, содержащий копии объектов
  // из исходного массива oPosts, но без изменения исходного массива
  //получает массив,возвращает дерево
  // обойти posts и составить словарь для доступа к заметкам по id
  const postsMap: Record<string, PostNode> = posts.reduce(
    //чтобы по id найти заметку
    (acc: Record<string, PostNode>, cur) => {
      acc[cur.id] = cur;
      return acc;
    },
    {}
  );
  // собрать дерево из заметок и сообщений, дочерние элементы ссылаются на родительские с помощью reply_to
  const postNodes: PostNode[] = []; // массив для хранения верхнеуровневых узлов дерева
  for (const post of posts) {
    if (!post.reply_to || "null" === post.reply_to) {
      postNodes.push(post); //если нет reply_to, то добавляем post в верхний уровень дерева
    }
  }
  for (const post of posts) {
    //ответ на заметку
    if (post.reply_to && "null" !== post.reply_to) {
      if (!postsMap[post.reply_to]) {
        //
        console.log( `для элемента  ${post.id} отсутствует родительский` );
      } else {
        if (!postsMap[post.reply_to]?.children) {
          //если нет дочерних элементов
          postsMap[post.reply_to].children = []; //пустой массив дочерних элементов
        }
        postsMap[post.reply_to].children?.push(post); //добавляем post в дочерние элементы
      }
    }
  }

  return { treeNotes: postNodes, dPosts: postsMap }; //вернем дерево и словарь постов по id
};
