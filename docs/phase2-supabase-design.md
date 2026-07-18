# Phase 2: Supabase設計メモ

Phase 1では認証や永続保存を実装しません。この文書は、現在のローカルデータをSupabaseへ移すときの境界を先に決めておくための設計メモです。

## 想定テーブル

- `profiles`: `auth.users.id`と1対1。表示名、管理者ロールを保持。
- `user_vocal_profiles`: 安定音域、最大音域、歌唱レベル、好み、目標を保持。
- `artists`: アーティスト名と読みを保持。
- `songs`: 曲の基本情報と歌唱指標を保持。
- `song_sections`: 曲構成、時間、音域、練習ポイントを保持。
- `lyric_lines`: `original_text`、`normalized_text`、`reading_text`、時間を保持。
- `vocal_techniques`: 技法ID、表示名、色、説明を保持。技法を後から追加可能にする。
- `lyric_annotations`: 行ID、開始/終了文字位置、音高、難易度、説明、公開状態を保持。
- `lyric_annotation_techniques`: 1注釈に複数技法を結び付ける中間テーブル。
- `user_favorites`: ユーザーごとのお気に入り。
- `user_song_lists`: 歌いたい、練習中、歌える、苦手の状態。
- `user_song_interactions`: 閲覧、クリック、練習、評価などの行動。
- `search_histories`: 正規化前後の検索語と検索種別。
- `practice_histories`: 行または曲単位の練習開始・完了。
- `recommendation_results`: スコア内訳、理由、計算バージョン。
- `ai_annotation_candidates`: AI候補、根拠、承認者、承認状態。承認済みだけ公開対象にする。

## 外部キーと主なインデックス

- 曲に属するデータはすべて`on delete cascade`で曲IDへ接続。
- ユーザーデータはすべて`auth.users.id`へ接続し、ユーザー削除時に削除。
- `lyric_lines(song_id, section_id, order)`と`song_sections(song_id, order)`へ複合インデックス。
- `lyric_lines.normalized_text`と`reading_text`へ将来の全文検索用GINインデックス。
- `user_song_interactions(user_id, song_id, interaction_type, created_at)`へ複合インデックス。
- お気に入りなどの重複を防ぐため、`(user_id, song_id)`へ一意制約。
- 重複しやすい閲覧行動は一定時間ごとにまとめ、練習完了や評価はイベントとして保持。

## Row Level Security方針

- `songs`、公開済み`lyric_lines`、承認済み`lyric_annotations`は未ログインでも読める。
- プロフィール、履歴、お気に入り、評価は`auth.uid() = user_id`の行だけ読み書きできる。
- 管理用の曲・歌詞・注釈更新は`profiles.role = 'admin'`のユーザーだけ許可。
- `ai_annotation_candidates`は管理者だけ読め、一般ユーザーへ直接公開しない。
- サービスロールキーはサーバーだけで使用し、ブラウザへ渡さない。

## UIとの分離

現在の`data/`を読む処理をリポジトリ関数へ置き換え、`lib/song-search.ts`、`lib/annotations.ts`、`lib/recommendation.ts`はそのまま利用できる形を維持します。
