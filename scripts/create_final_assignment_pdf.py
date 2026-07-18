#!/usr/bin/env python3
"""UtaFit最終課題レポートPDFを生成する。"""

from __future__ import annotations

import argparse
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "UtaFit_最終課題レポート.pdf"
OG_IMAGE = ROOT / "public" / "og.png"

INK = colors.HexColor("#171614")
MUTED = colors.HexColor("#6E6A64")
LINE = colors.HexColor("#E7E2DB")
PAPER = colors.HexColor("#FBFAF7")
ACCENT = colors.HexColor("#FF5A3C")
ACCENT_DARK = colors.HexColor("#D94328")
ACCENT_SOFT = colors.HexColor("#FFF0EC")
MINT = colors.HexColor("#DDF4EC")


def register_fonts() -> tuple[str, str]:
    regular_candidates = [
        Path("/System/Library/Fonts/Supplemental/Arial Unicode.ttf"),
        Path("/System/Library/Fonts/ヒラギノ角ゴシック W8.ttc"),
        Path("/System/Library/Fonts/ヒラギノ角ゴシック W8.ttc"),
    ]
    bold_candidates = [
        Path("/System/Library/Fonts/Supplemental/Arial Unicode.ttf"),
        Path("/System/Library/Fonts/ヒラギノ角ゴシック W9.ttc"),
        Path("/System/Library/Fonts/ヒラギノ角ゴシック W9.ttc"),
    ]

    regular = next((path for path in regular_candidates if path.exists()), None)
    bold = next((path for path in bold_candidates if path.exists()), regular)
    if regular is None or bold is None:
        raise FileNotFoundError("日本語フォントが見つかりません。")

    regular_args = {"subfontIndex": 0} if regular.suffix.lower() == ".ttc" else {}
    bold_args = {"subfontIndex": 0} if bold.suffix.lower() == ".ttc" else {}
    pdfmetrics.registerFont(TTFont("UtaFitJP", str(regular), **regular_args))
    pdfmetrics.registerFont(TTFont("UtaFitJP-Bold", str(bold), **bold_args))
    pdfmetrics.registerFontFamily(
        "UtaFitJP",
        normal="UtaFitJP",
        bold="UtaFitJP-Bold",
        italic="UtaFitJP",
        boldItalic="UtaFitJP-Bold",
    )
    return "UtaFitJP", "UtaFitJP-Bold"


def make_styles(font: str, bold_font: str) -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "eyebrow": ParagraphStyle(
            "Eyebrow",
            parent=base["Normal"],
            fontName=bold_font,
            fontSize=8.2,
            leading=10,
            textColor=ACCENT_DARK,
            spaceAfter=2.5 * mm,
            wordWrap="CJK",
        ),
        "title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontName=bold_font,
            fontSize=27,
            leading=34,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=4 * mm,
            wordWrap="CJK",
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["Normal"],
            fontName=font,
            fontSize=11,
            leading=18,
            textColor=MUTED,
            wordWrap="CJK",
        ),
        "h1": ParagraphStyle(
            "Heading1JP",
            parent=base["Heading1"],
            fontName=bold_font,
            fontSize=19,
            leading=25,
            textColor=INK,
            spaceBefore=4 * mm,
            spaceAfter=4 * mm,
            wordWrap="CJK",
        ),
        "h2": ParagraphStyle(
            "Heading2JP",
            parent=base["Heading2"],
            fontName=bold_font,
            fontSize=12.5,
            leading=18,
            textColor=INK,
            spaceBefore=4 * mm,
            spaceAfter=2 * mm,
            wordWrap="CJK",
        ),
        "body": ParagraphStyle(
            "BodyJP",
            parent=base["BodyText"],
            fontName=font,
            fontSize=9.4,
            leading=16.5,
            textColor=colors.HexColor("#3F3B36"),
            spaceAfter=3.3 * mm,
            wordWrap="CJK",
            splitLongWords=True,
        ),
        "body_bold": ParagraphStyle(
            "BodyBoldJP",
            parent=base["BodyText"],
            fontName=bold_font,
            fontSize=9.4,
            leading=16,
            textColor=INK,
            spaceAfter=2.5 * mm,
            wordWrap="CJK",
        ),
        "small": ParagraphStyle(
            "SmallJP",
            parent=base["BodyText"],
            fontName=font,
            fontSize=7.8,
            leading=12.5,
            textColor=MUTED,
            wordWrap="CJK",
        ),
        "small_bold": ParagraphStyle(
            "SmallBoldJP",
            parent=base["BodyText"],
            fontName=bold_font,
            fontSize=8.1,
            leading=12.5,
            textColor=INK,
            wordWrap="CJK",
        ),
        "callout": ParagraphStyle(
            "CalloutJP",
            parent=base["BodyText"],
            fontName=bold_font,
            fontSize=9.6,
            leading=16,
            textColor=ACCENT_DARK,
            wordWrap="CJK",
        ),
        "quote": ParagraphStyle(
            "QuoteJP",
            parent=base["BodyText"],
            fontName=bold_font,
            fontSize=13.5,
            leading=21,
            alignment=TA_CENTER,
            textColor=INK,
            wordWrap="CJK",
        ),
        "center_small": ParagraphStyle(
            "CenterSmallJP",
            parent=base["BodyText"],
            fontName=font,
            fontSize=9.4,
            leading=15,
            alignment=TA_CENTER,
            textColor=MUTED,
            wordWrap="CJK",
        ),
    }


def p(text: str, style: str, styles: dict[str, ParagraphStyle]) -> Paragraph:
    return Paragraph(text, styles[style])


def bullet(text: str, styles: dict[str, ParagraphStyle]) -> Paragraph:
    return Paragraph(f"<font color='#FF5A3C'>●</font>  {text}", styles["body"])


def section_heading(number: str, label: str, title: str, styles: dict[str, ParagraphStyle]):
    return [
        p(f"{number}  /  {label.upper()}", "eyebrow", styles),
        p(title, "h1", styles),
        HRFlowable(width="100%", thickness=0.7, color=LINE, spaceAfter=5 * mm),
    ]


def card_table(cards: list[tuple[str, str]], styles: dict[str, ParagraphStyle], widths=None) -> Table:
    cells = []
    for title, body in cards:
        cells.append(
            [
                p(title, "small_bold", styles),
                Spacer(1, 1.5 * mm),
                p(body, "small", styles),
            ]
        )
    table = Table([cells], colWidths=widths or [52 * mm] * len(cells), hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.7, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5 * mm),
                ("TOPPADDING", (0, 0), (-1, -1), 5 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5 * mm),
            ]
        )
    )
    return table


def add_page_decor(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, width, height, fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.6)
    canvas.line(18 * mm, 14 * mm, width - 18 * mm, 14 * mm)
    canvas.setFont("UtaFitJP-Bold", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 9 * mm, "UTAFIT  /  FINAL PROJECT REPORT 2026")
    canvas.drawRightString(width - 18 * mm, 9 * mm, f"{doc.page:02d}")
    canvas.restoreState()


def build_pdf(app_url: str, github_url: str) -> Path:
    font, bold_font = register_fonts()
    styles = make_styles(font, bold_font)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=18 * mm,
        bottomMargin=20 * mm,
        title="UtaFit 最終課題レポート",
        author="UtaFit project",
        subject="2026年 実践のためのWebプログラミング",
    )

    story = []

    story.extend(
        [
            Spacer(1, 7 * mm),
            p("FINAL PROJECT  /  2026", "eyebrow", styles),
            p("自分の声で、<br/><font color='#FF5A3C'>歌を選ぶ。</font>", "title", styles),
            p("音域・難易度・歌い方から、自分に合う歌と練習ポイントを探せる歌唱支援Webアプリ", "subtitle", styles),
            Spacer(1, 8 * mm),
        ]
    )
    if OG_IMAGE.exists():
        story.append(Image(str(OG_IMAGE), width=170 * mm, height=89.3 * mm))
    story.extend(
        [
            Spacer(1, 7 * mm),
            Table(
                [[p("UtaFit", "h2", styles), p("2026年 実践のためのWebプログラミング<br/>自由制作レポート", "small", styles)]],
                colWidths=[85 * mm, 85 * mm],
                style=TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                        ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 5 * mm),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 5 * mm),
                        ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
                    ]
                ),
            ),
            Spacer(1, 5 * mm),
            p("探す - 納得する - 練習する、をひとつの体験にする。", "quote", styles),
            PageBreak(),
        ]
    )

    story.extend(section_heading("01", "Theme", "テーマ", styles))
    story.extend(
        [
            p("<b>自分の安定音域と練習目的から、歌いやすい曲と歌い方を探せる歌唱支援Webアプリ「UtaFit」</b>を制作した。", "body", styles),
            p("カラオケで曲を選ぶとき、知っている曲という理由だけで決めると、実際には最高音が高すぎたり、裏声への切り替えやロングトーンが難しかったりする。そこで、曲名だけでなく、音域・声区・難易度・テンポ・歌唱指標から曲を探し、選んだ後の練習までつながるサービスをテーマにした。", "body", styles),
            Spacer(1, 2 * mm),
            card_table(
                [
                    ("01  探す", "曲名、特徴、雰囲気に加え、音域やテンポなど12種類の条件で絞り込む。"),
                    ("02  診断する", "安定音域、歌唱レベル、好み、練習目標から100点満点の相性を計算する。"),
                    ("03  練習する", "歌詞上の歌唱注釈を確認し、1フレーズずつ練習済みにできる。"),
                ],
                styles,
            ),
            Spacer(1, 7 * mm),
            p("サービスの前提", "h2", styles),
            p("収録データは実在曲20曲と、注釈デモ用の架空曲1曲である。実在曲の歌詞は保存せず、音域・BPM・難易度も動作確認用サンプル値であることを画面に明記した。", "body", styles),
            Table(
                [[p("権利への配慮", "small_bold", styles), p("実在曲の歌詞を掲載しない。注釈体験は架空曲に限定。", "small", styles)],
                 [p("精度への配慮", "small_bold", styles), p("未検証の値を正確な分析結果として見せず、サンプルであることを明示。", "small", styles)]],
                colWidths=[38 * mm, 132 * mm],
                style=TableStyle([
                    ("BACKGROUND", (0, 0), (0, -1), ACCENT_SOFT),
                    ("BACKGROUND", (1, 0), (1, -1), colors.white),
                    ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                    ("INNERGRID", (0, 0), (-1, -1), 0.7, LINE),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
                    ("TOPPADDING", (0, 0), (-1, -1), 3.5 * mm),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 3.5 * mm),
                ]),
            ),
            PageBreak(),
        ]
    )

    story.extend(section_heading("02", "Service", "サービスの説明", styles))
    flow_rows = [
        ["01", "検索", "入力中検索と12種類の絞り込み。検索条件はURLに残る。"],
        ["02", "診断", "音域35点、難易度20点など合計100点で相性を計算。"],
        ["03", "詳細", "音域幅、歌唱指標、難所、練習ポイント、似ている曲を確認。"],
        ["04", "注釈", "架空歌詞のどの部分で、どの声や技法を使うかを色と線で表示。"],
        ["05", "練習", "前後のフレーズとコツを見ながら1行ずつ進め、進捗を端末に保存。"],
    ]
    flow_table = Table(
        [[p(row[0], "small_bold", styles), p(row[1], "small_bold", styles), p(row[2], "small", styles)] for row in flow_rows],
        colWidths=[16 * mm, 28 * mm, 126 * mm],
        repeatRows=0,
    )
    flow_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), ACCENT),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.white),
        ("BACKGROUND", (1, 0), (-1, -1), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.7, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.7, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("ALIGN", (0, 0), (0, -1), "CENTER"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
        ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
    ]))
    story.extend(
        [
            flow_table,
            Spacer(1, 7 * mm),
            p("主な画面", "h2", styles),
            card_table(
                [
                    ("/songs", "検索・絞り込み・並び替え・0件表示"),
                    ("/recommend", "匿名で使える音域・好み診断"),
                    ("/songs/[id]", "歌唱指標・注釈・練習・類似曲"),
                ],
                styles,
            ),
            Spacer(1, 5 * mm),
            Table(
                [[p("実装済み", "small_bold", styles), p("21曲 / 7種類の並び替え / 12種類の絞り込み / 1行練習 / 制作ブログ", "small", styles)]],
                colWidths=[34 * mm, 136 * mm],
                style=TableStyle([
                    ("BACKGROUND", (0, 0), (-1, -1), MINT),
                    ("BOX", (0, 0), (-1, -1), 0.7, colors.HexColor("#B9DFD1")),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
                    ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
                ]),
            ),
            PageBreak(),
        ]
    )

    story.extend(section_heading("03", "Architecture", "設計の説明", styles))
    story.extend(
        [
            p("画面部品、データ、計算処理を分離した。検索は <b>lib/song-search.ts</b>、推薦は <b>lib/recommendation.ts</b>、歌詞注釈の区間計算は <b>lib/annotations.ts</b> にまとめ、UIに依存しない純粋関数としてテストできるようにした。", "body", styles),
            Spacer(1, 2 * mm),
            Table(
                [[p("UI", "small_bold", styles)], [p("検索・診断・曲詳細・練習", "small", styles)], [p("↓", "small_bold", styles)], [p("純粋関数", "small_bold", styles)], [p("検索 / 推薦 / 注釈 / 音名変換", "small", styles)], [p("↓", "small_bold", styles)], [p("データ", "small_bold", styles)], [p("曲 / セクション / 架空歌詞 / 技法", "small", styles)]],
                colWidths=[86 * mm],
                hAlign="CENTER",
                style=TableStyle([
                    ("BACKGROUND", (0, 0), (0, 1), colors.white),
                    ("BACKGROUND", (0, 3), (0, 4), ACCENT_SOFT),
                    ("BACKGROUND", (0, 6), (0, 7), MINT),
                    ("BOX", (0, 0), (0, 1), 0.8, LINE),
                    ("BOX", (0, 3), (0, 4), 0.8, colors.HexColor("#FFB6A8")),
                    ("BOX", (0, 6), (0, 7), 0.8, colors.HexColor("#B9DFD1")),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
                ]),
            ),
            Spacer(1, 7 * mm),
            p("推薦スコアの設計", "h2", styles),
            p("推薦はブラックボックスのAIではなく、次の内訳を合計する。点数だけでなく、最大4件の推薦理由も返すため、利用者が結果を解釈できる。", "body", styles),
            Table(
                [[p(label, "small_bold", styles), p(points, "small_bold", styles)] for label, points in [("音域", "35点"), ("難易度", "20点"), ("ジャンル", "10点"), ("曲調", "10点"), ("アーティスト", "10点"), ("類似曲", "10点"), ("練習目標", "5点")]],
                colWidths=[60 * mm, 25 * mm],
                hAlign="LEFT",
                style=TableStyle([
                    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                    ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                    ("INNERGRID", (0, 0), (-1, -1), 0.7, LINE),
                    ("ALIGN", (1, 0), (1, -1), "RIGHT"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
                    ("TOPPADDING", (0, 0), (-1, -1), 2.5 * mm),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 2.5 * mm),
                ]),
            ),
            PageBreak(),
        ]
    )

    story.extend(section_heading("04", "Originality", "自分なりにこだわった点", styles))
    originality = [
        ("推薦理由を説明できるようにした", "単に「おすすめ度90点」と表示せず、点数の内訳と「地声最高音が安定音域内」などの理由を表示した。生成AIが一般化しても、判断材料を利用者へ返す設計は重要だと考えた。"),
        ("著作権とデータ精度を曖昧にしなかった", "実在曲の歌詞を無断で掲載せず、歌詞注釈は架空曲に限定した。確認していない音域データを正確な分析のように見せず、サンプル値であることを明示した。"),
        ("重なる歌詞注釈を表現した", "同じ文字列に複数技法が重なる場合、開始位置と終了位置を境界に歌詞を分割し、各区間に重なる注釈をまとめた。重複部分は二重線で示した。"),
        ("MVPの範囲を決めた", "アカウント、お気に入り、履歴、データベース接続、AI注釈候補は将来機能とし、今回は検索・診断・注釈・練習という中心価値に集中した。"),
    ]
    for index, (title, body) in enumerate(originality, start=1):
        story.append(
            KeepTogether(
                [
                    Table(
                        [[p(f"0{index}", "small_bold", styles), p(title, "body_bold", styles)]],
                        colWidths=[16 * mm, 154 * mm],
                        style=TableStyle([
                            ("BACKGROUND", (0, 0), (0, 0), ACCENT),
                            ("BACKGROUND", (1, 0), (1, 0), colors.white),
                            ("TEXTCOLOR", (0, 0), (0, 0), colors.white),
                            ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                            ("ALIGN", (0, 0), (0, 0), "CENTER"),
                            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                            ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
                            ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
                            ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
                            ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
                        ]),
                    ),
                    Table(
                        [[p(body, "small", styles)]],
                        colWidths=[170 * mm],
                        style=TableStyle([
                            ("BACKGROUND", (0, 0), (-1, -1), PAPER),
                            ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                            ("LEFTPADDING", (0, 0), (-1, -1), 6 * mm),
                            ("RIGHTPADDING", (0, 0), (-1, -1), 6 * mm),
                            ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
                            ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
                        ]),
                    ),
                    Spacer(1, 4 * mm),
                ]
            )
        )
    story.append(PageBreak())

    story.extend(section_heading("05", "Learning", "学びになったこと・感想", styles))
    learning_items = [
        "要件を機能一覧のまま受け取らず、利用者が困る場面に置き換える必要がある。",
        "URLと画面状態を同期すると、再読み込みや共有に強いWebサービスになる。",
        "複雑な表示は、先にデータ構造と計算処理を決めると実装しやすい。",
        "UIと計算を分離すると、テストで境界値や例外を確認できる。",
        "AIにコードを書かせる場合でも、仕様、権利、データの正しさは人が判断しなければならない。",
    ]
    story.extend([bullet(item, styles) for item in learning_items])
    story.extend(
        [
            Spacer(1, 2 * mm),
            Table(
                [[p("<font color='#FFFFFF'>VALIDATION</font>", "small_bold", styles), p("自動テスト 19件成功", "small_bold", styles), p("静的解析 成功", "small_bold", styles), p("本番ビルド 成功", "small_bold", styles)]],
                colWidths=[34 * mm, 45 * mm, 43 * mm, 48 * mm],
                style=TableStyle([
                    ("BACKGROUND", (0, 0), (0, 0), INK),
                    ("TEXTCOLOR", (0, 0), (0, 0), colors.white),
                    ("BACKGROUND", (1, 0), (-1, -1), MINT),
                    ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                    ("INNERGRID", (0, 0), (-1, -1), 0.7, LINE),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
                ]),
            ),
            Spacer(1, 7 * mm),
            p("感想", "h2", styles),
            p("最初は曲検索機能を中心に考えていたが、設計を進めるうちに「曲を見つけた後、どう練習するか」までつながらないとサービスとして弱いと感じた。そのため、歌詞注釈と1行練習を追加し、探す・納得する・練習するという流れに整理した。", "body", styles),
            p("また、生成AIを使うと実装速度は上がるが、候補が多く出る分、何を採用し何を削るかを言語化する必要があった。AIの出力を完成品と考えず、設計案を広げる相手として使い、最後はテストと画面で確かめることが大切だと感じた。", "body", styles),
            Table(
                [[p("プログラミングは画面を作る作業だけではなく、<br/>信頼できる情報の範囲と、今回は作らないものを決める作業でもある。", "callout", styles)]],
                colWidths=[170 * mm],
                style=TableStyle([
                    ("BACKGROUND", (0, 0), (-1, -1), ACCENT_SOFT),
                    ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#FFB6A8")),
                    ("LEFTPADDING", (0, 0), (-1, -1), 7 * mm),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 7 * mm),
                    ("TOPPADDING", (0, 0), (-1, -1), 5 * mm),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 5 * mm),
                ]),
            ),
            PageBreak(),
        ]
    )

    story.extend(section_heading("06", "AI Collaboration", "AIの活用方法", styles))
    story.extend(
        [
            p("AIには、要件整理、データ型と画面構成の案出し、実装のたたき台、テスト観点の洗い出し、文章の推敲を手伝ってもらった。一方で、テーマ、優先順位、MVPの境界、著作権への配慮、推薦を説明可能にする方針は人が判断する項目として扱った。", "body", styles),
            card_table(
                [
                    ("AIに任せたこと", "選択肢の展開 / コードの下書き / テスト観点 / 文書の推敲"),
                    ("人が判断したこと", "テーマ / 優先順位 / 権利 / データの扱い / MVPの境界"),
                    ("確認したこと", "ソースコード / 19件のテスト / 静的解析 / 本番ビルド"),
                ],
                styles,
            ),
            Spacer(1, 8 * mm),
            p("使用技術", "h2", styles),
            Table(
                [[p("<font color='#FFFFFF'>FRONTEND</font>", "small_bold", styles), p("TypeScript / React / Next.js / Tailwind CSS", "small", styles)],
                 [p("<font color='#FFFFFF'>QUALITY</font>", "small_bold", styles), p("Vitest / TypeScript / ESLint", "small", styles)],
                 [p("<font color='#FFFFFF'>WORKFLOW</font>", "small_bold", styles), p("Node.js / Git / GitHub", "small", styles)]],
                colWidths=[42 * mm, 128 * mm],
                style=TableStyle([
                    ("BACKGROUND", (0, 0), (0, -1), INK),
                    ("TEXTCOLOR", (0, 0), (0, -1), colors.white),
                    ("BACKGROUND", (1, 0), (1, -1), colors.white),
                    ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                    ("INNERGRID", (0, 0), (-1, -1), 0.7, LINE),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
                    ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
                ]),
            ),
            Spacer(1, 8 * mm),
            p("提出リンク", "h2", styles),
            Table(
                [[p("自作アプリ", "small_bold", styles), p(app_url, "small", styles)],
                 [p("制作ブログ", "small_bold", styles), p(f"{app_url.rstrip('/')}/project-story" if app_url.startswith("http") else "自作アプリURLの末尾に /project-story", "small", styles)],
                 [p("GitHub", "small_bold", styles), p(github_url, "small", styles)]],
                colWidths=[36 * mm, 134 * mm],
                style=TableStyle([
                    ("BACKGROUND", (0, 0), (0, -1), ACCENT_SOFT),
                    ("BACKGROUND", (1, 0), (1, -1), colors.white),
                    ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                    ("INNERGRID", (0, 0), (-1, -1), 0.7, LINE),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
                    ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
                ]),
            ),
            Spacer(1, 9 * mm),
            p("UtaFit", "quote", styles),
            p("自分の声で、歌を選ぶ。", "center_small", styles),
        ]
    )

    doc.build(story, onFirstPage=add_page_decor, onLaterPages=add_page_decor)
    return OUTPUT


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--app-url", default="公開後のURLを記入")
    parser.add_argument("--github-url", default="公開後のURLを記入")
    args = parser.parse_args()
    output = build_pdf(args.app_url, args.github_url)
    print(output)


if __name__ == "__main__":
    main()
